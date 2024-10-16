import "/ecjs.v3.js"

// defines html; w/ html lint extension

const template = /*html*/`
<style>
    .card {
  position: relative;
  width: 11.875em;
  height: 16.5em;
  box-shadow: 0px 1px 13px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 120ms;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 0.5em;
  overflow: hidden;
  padding-bottom: 3.4em;
  width: 100%;
  height: 100%;
}

.card::after {
  content: "Add to Cart";
  padding-top: 1.25em;
  padding-left: 1.25em;
  position: absolute;
  left: 0;
  bottom: -60px;
  background: #00AC7C;
  color: #fff;
  height: 2.5em;
  width: 100%;
  transition: all 80ms;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0;
}

.card .title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9em;
  position: absolute;
  left: 0.625em;
  bottom: 1.875em;
  font-weight: 400;
  color: #000;
}

.card .price {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 0.9em;
  position: absolute;
  left: 0.625em;
  bottom: 0.625em;
  color: #000;
}

.card:hover::after {
  bottom: 0;
  opacity: 1;
}

.card:active {
  transform: scale(0.98);
}

.card:active::after {
  content: "Added !";
  height: 3.125em;
}

.text {
  width: 100%;
  z-index: 2;
  position: absolute;
  text-align: center;
  background-color: rgba(255,255,255,0.4);
  padding: 20px;
}

.image {
  width: 100%;
  background-color: rgba(0,0,0,0.05);
 height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
}

img {
    width: 100%;
    height: 100%;
    object-fit:cover;
}
</style>

<div class="card" onclick="dom().cardAlert()">
<div class="image"><img id="image-display"><span class="text"></span></div>
  <span class="title"></span>
  <span class="price"></span>
</div>
`

ecjs.createComponent('material-card', template, 
    (dom, vars)=>{
        vars.title = dom.useState(dom.getAttribute('title')).bind('.title')
        dom.caption = dom.useState(dom.getAttribute('caption')).bind('.text')
        dom.price = dom.useState(dom.getAttribute('price')).bind('.price')
        dom.src = dom.useState()
        
        dom.cardAlert = () => {
            alert(`${vars.title.value} is added to cart!`)
        }

        dom.useEffect((dom)=>{
            dom.select('#image-display').src = dom.src.value
        },[dom.src], dom)

        dom.src.value = dom.getAttribute('src')
    }
)
