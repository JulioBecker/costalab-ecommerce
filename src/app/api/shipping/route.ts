import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cep, items } = await request.json();

    if (!cep) {
      return NextResponse.json({ error: 'CEP de destino é obrigatório' }, { status: 400 });
    }

    // Origin CEP is hardcoded to 89248-000 as requested
    const originCep = '89248000';
    // Clean destination CEP
    const destCep = cep.replace(/\D/g, '');

    // Setup basic dimensions per item (using standardized T-shirt dimensions: 0.3kg, 20x20x5 cm)
    // If the cart items have quantity, respect it.
    let totalWeight = 0;
    let totalValue = 0;
    
    // Melhor Envio Box Model
    // We can send multiple products, or package them into a single box. 
    // To simplify, we send product definitions for Melhor Envio to calculate
    const products = [];
    
    if (items && items.length > 0) {
      items.forEach((item: any) => {
        totalValue += (item.price * item.qty);
        products.push({
          id: item.productId,
          weight: 0.3, // kg
          width: 20, // cm
          height: 5, // cm
          length: 20, // cm
          insurance_value: item.price,
          quantity: item.qty
        });
      });
    } else {
      // Default fallback if no items passed
      products.push({
        id: "1",
        weight: 0.3, width: 20, height: 5, length: 20,
        insurance_value: 0,
        quantity: 1
      });
    }

    const token = process.env.MELHOR_ENVIO_TOKEN;

    if (!token) {
       console.error("Melhor Envio token missing from .env.local");
       return NextResponse.json({ error: 'Token de integração com Melhor Envio não encontrado no servidor.' }, { status: 500 });
    }

    const payload = {
      from: {
        postal_code: originCep
      },
      to: {
        postal_code: destCep
      },
      products: products
    };

    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'CostaLab (support@costalab.com)' // Good practice for ME API
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      console.error("Melhor Envio Error:", errorData);
      
      let errorMsg = errorData.message || errorData.error || 'Erro ao calcular frete no Melhor Envio';
      if (response.status === 401) {
        errorMsg = "Token inválido (Se esse token foi gerado no painel oficial, ele é de Produção e não funciona na url Sandbox). Tente trocar a URL no código.";
      }
      
      return NextResponse.json({ error: errorMsg, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    
    // The API returns an array or object depending on services. 
    // Usually it returns an array of calculating services.
    // We map it to the structure our frontend expects: { name, price, deadline }
    // Filter out services that returned an error (they will have an "error" property)
    const validServices = Array.isArray(data) ? data.filter((s: any) => !s.error) : [];
    
    const formattedRates = validServices.map((service: any) => ({
      name: `${service.company.name} (${service.name})`,
      price: parseFloat(service.price),
      deadline: service.delivery_time
    }));

    // Sort by price ascending
    formattedRates.sort((a, b) => a.price - b.price);

    return NextResponse.json({ rates: formattedRates });

  } catch (error: any) {
    console.error("Erro interno cálculo de frete:", error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}
