import "/ecjs.v3.js"

// defines html; w/ html lint extension
const template = /*html*/`
<style>
    .ripple-btn {
        position: relative;
        display: inline-block;
        padding: 10px 20px;
        width: 100% !important;
        height: 100% !important;
        background-color: blue; 
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;    
        overflow: hidden; 
        transition: transform 0.1s ease-in-out; 
        flex-wrap: wrap;
    }

    .ripple-btn:hover {
        transform: scale(1.05); 
    }

    .ripple-btn::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0.2);
        transform-origin: center center;
        transition: transform 0.6s ease-out, opacity 0.6s ease-out;
        opacity: 0;
        pointer-events: none;
    }

    .ripple-btn:active::before {
        transform: scale(1);
        opacity: 1;
        transition: transform 0.3s ease-out, opacity 0.6s ease-out;
    }

    #ec-btn-slot {
        display: inline-block;
        white-space: normal;
        word-wrap: break-word;
        width: 100%; 
        font-size: 20px;
        color: white;
    }

</style>
<button class="ripple-btn" id="ripple-btn">
    <slot></slot> 
</button>
`

createComponent('nice-button', template, 
    (dom)=>{ // dom: element with isolated dom
        const btn = dom.select('#ripple-btn')
        btn.style = dom.getAttribute('btn-style')

        dom.elements.rippleButton = btn // stores element #ripple-btn to elements object of dom
    }
)