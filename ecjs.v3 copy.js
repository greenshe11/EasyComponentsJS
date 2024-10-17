globalThis.ecjs = {}

let componentCounter = 0
const componentsAll = {}


const utilFunctions = {
    select: (arg)=>{return document.querySelector(arg)},
    selectAll: (arg)=>{return document.querySelector(arg)},
    useState: useState,
    useEffect: useEffect,
    createComponent: createComponent,
    createPage: createComponent
}

async function createComponent (tagName, htmlString, script) {
    class MyComponent extends HTMLElement {
        // -------------------------------------------------------//
        #script = async (dom, vars) => {return script(dom, vars)}
        #template = document.createElement('template')
        
        // -------------------------------------------------------//
        constructor() {
            super(); 
            this.attachShadow({ mode: 'open' })
            this.variables = useState({vars: {dom: this}})

            const identifier = `ecjs-component-id-${componentCounter}`
            componentCounter += 1
            componentsAll[identifier] = this
            

            if (htmlString){
                htmlString = htmlString.replace(/dom\s*\(\s*\)\s*/g, `ecjs.getComponent('${identifier}')`)
                this.#template.innerHTML = htmlString
                this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
               
            }

            for (let index in utilFunctions){
                if ((this[index])){ continue} // dont replace existing ones
                this[index] = utilFunctions[index]
            }
        }
        // ------------------------------------------------------//
        useState(initialValue){return useState(initialValue, this)}
        select (arg){return this.shadowRoot.querySelector(arg)}
        selectAll(arg){return this.shadowRoot.querySelectorAll(arg)}

        // ------------------------------------------------------//
        get vars () {
            return this.variables.value.vars
        }
        
        connectedCallback() {
            this.#script(this, this.variables.value.vars)
        }

        disconnectedCallback() {
        }

    }

    customElements.define(tagName, MyComponent);
  

}


class States{
    constructor (initialValue, dom) {
        this._value = initialValue
        this.dependencies = []
        this.ecjs = dom?dom:ecjs
    }
   

    bind(object){
        if (typeof object == 'string'){
           object = this.ecjs.select(object)
        }
       
        if (!object){
            const finder = this.ecjs instanceof HTMLElement ? this.ecjs.outerHTML : 'Document'
            console.warn(`${object} is not found nor a valid HTMLElement or State in ${finder}`)
        }
        
        
        const element = object

        if (object instanceof States){
           
            useEffect((object)=>{
                object.value = this.value
            }, [this], object)

            object.value = this.value

        } else if (object instanceof HTMLElement){
            useEffect((object)=>{
                element.innerHTML = this._value
            }, [this], object)
            element.innerHTML = this._value
        } else {
            throw Error('Object must be HTMLElement or States object or "selector string"')
        }
     
         
        return this
    }

   

    ref(){
        return this
    }
    
    set value (_value){  
        this._value = _value
        this.invoke()   
    }

    set current (_value){  
        this._value = _value
        this.invoke()   
    }

    get value(){
        return this._value
    }

    get current(){
        return this._value
    }


    invoke(){
        this.dependencies.forEach((_value, index)=>{
            _value.func(_value.args)
        })
    }
}


function useState (initialValue, dom) {
    const object = new States(initialValue||"   ", dom)
    return object
}

function useEffect (script, dependencies, args) {
    dependencies.forEach((state, index)=>{
        if (!state){
        
            console.warn(`one or more specified %cState%c object is ${state}`,"font-weight: bold;   color: orange;","")
        }
        state.dependencies.push({func: script, args: args})
    })
}

ecjs.getComponent = (identifier) => {
    return componentsAll[identifier]
}



for (let index in utilFunctions){
    globalThis.ecjs[index] = utilFunctions[index]   
}

createComponent('ecjs-setting', 
    undefined,
    (dom)=>{
        const global = dom.getAttribute('global')
        const createGlobalVar = () => { // make global variables
            if(global){
                for (let index in utilFunctions){
                    globalThis[index] = utilFunctions[index]
                }
            }
            
        }
        createGlobalVar()
    }
)


