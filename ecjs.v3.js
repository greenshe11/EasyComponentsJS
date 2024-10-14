function createComponent (tagName, htmlString, script) {
    class MyComponent extends HTMLElement {
        constructor() {
            super(); 

            this.attachShadow({ mode: 'open' });
            const template = document.createElement('template');
            this._template_ = template
            this._script_ = script
            this.elements = {}
            this.data = {}
            template.innerHTML = htmlString

            this.select = (arg) => {return this.shadowRoot.querySelector(arg)}
            this.selectAll = (arg) => {return this.shadowRoot.querySelectorAll(arg)}
            
            this.shadowRoot.appendChild(this._template_.content.cloneNode(true));
        }
            
        connectedCallback() {
            this._script_(this)
        }

        disconnectedCallback() {
        }

    }
    customElements.define(tagName, MyComponent);
}


class States{
    constructor (initialValue) {
        this._value = initialValue
        this.dependencies = []
    }

    bind(element){
        this.dependencies.push(()=>{
            element.innerHTML = this._value
        })
        element.innerHTML = this._value 
        return this
    }

    update(value){
        this._value = value
        this.runDependencies()
        return this
    }

    value(){
        return this._value
    }

    runDependencies(){
        this.dependencies.forEach((value, index)=>{
            value()
        })
    }
}


function useState (initialValue) {
    const object = new States(initialValue)
    return object
}

function useEffect (script, dependencies) {
    dependencies.forEach((state, index)=>{
        state.dependencies.push(script)
    })
}

document.body.style.opacity = "1"

globalThis.useState = useState
globalThis.createComponent = createComponent
globalThis.useEffect = useEffect