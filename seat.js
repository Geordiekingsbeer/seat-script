<div id="pt-root"></div>
<script type="module">
  const hook = 'https://hook.make.com/YOUR_WEBHOOK_KEY';   // ← replace with yours
  const venue = 'bistro51';

  // fetch availability (we’ll fake it for now)
  const tables = [
    {id:1, x:10,  y:10, w:90, h:70, free:true,  name:'T-1'},
    {id:2, x:110, y:10, w:90, h:70, free:true,  name:'T-2'},
    {id:3, x:210, y:10, w:90, h:70, free:false, name:'T-3'},
    {id:4, x:310, y:10, w=90, h:70, free:true,  name:'T-4'},
    {id:5, x:410, y=10, w=90, h=70, free:true,  name:'T-5'},
    {id:6, x=510, y=10, w=90, h=70, free:false, name:'T-6'}
  ];

  let chosen = null;
  async function pick(id){
    const t = tables.find(t=>t.id===id);
    if (!t.free) return alert('Table taken - pick another!');
    chosen = id;
    // send pick to Make → Stripe Checkout
    const resp = await fetch(hook, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({venue, table:id, price:499})
    });
    const {checkoutUrl} = await resp.json();
    window.location = checkoutUrl;   // jump to Stripe
  }

  // render SVG
  document.getElementById('pt-root').innerHTML = `
    <h3 style="font-family:sans-serif;margin:0 0 8px 0">Pick your exact table - $4.99</h3>
    <svg width="610" height="100" style="border:1px solid #ccc;border-radius:8px">
      ${tables.map(t=>`
        <g onClick="pick(${t.id})" style="cursor:pointer">
          <rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" 
                fill="${t.free?(chosen===t.id?'orange':'#10b981'):'#9ca3af'}" rx="8"></rect>
          <text x="${t.x+10}" y="${t.y+40}" fill="white" font-size="20">${t.name}</text>
        </g>`).join('')}
    </svg>`;
</script>
