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

            const identifier = `<${tagName}>{${componentCounter}}`
            componentCounter += 1
            componentsAll[identifier] = this
            this.props = {}
            this.propsProxy = new Proxy(this.props, this.propsHandler)
            

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
       
        propsHandler = {
            
            set: (target, property, value) => {
                if (property == 'states'){
                    console.error(`Cannot assign ${value} to a reserved key "states".`)
                    return () => {return this.props}
                }

                if (!(property in target)){
                    target[property] = this.useState(value?value:this.getAttribute(property))
                }else{
                    target[property]._value = value
                    target[property].invoke()
                }

                return target[property] // Return true to indicate successful assignment
            },
    
            get: (target, property) => {
                // Check if the property exists in the instance
                if (property == 'states'){
                    return () => {return this.props}
                }
                if (property in target) {
                    if (property.startsWith('$')){
                        return target[property]._value
                    }
                    return target[property]
                }

                
                target[property] = this.useState(this.getAttribute(property))
                
                target['$'+property] = target[property]

                return this.propsProxy[property]
                // If it does not exist, return the internal _value
               
            },
            
            
        }
        // ------------------------------------------------------//
        get vars () {
            return this.variables.value.vars
        }
        
        connectedCallback() {
            this.#script(this, this.propsProxy)
       
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

    apply (target, thisArg, argumentsList) {
        return this
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
           console.log("OBJECT!")
           console.log(this)
            useEffect((object)=>{
                console.log("CHANGING")
                object._value = this._value
            }, [this], object)
            object.value = this.value
            console.log('dependeidnec',this.dependencies)
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


    invoke(index){
        if (index){
            this.dependencies[index].func(this.dependencies[index.args])
            return this
        }
        this.dependencies.forEach((_value, index)=>{
            _value.func(_value.args)
        })
        return this
    }
}


function useState (initialValue, dom) {
    const object = new States(initialValue||"   ", dom)
    return object
}

function useEffect (script, dependencies, args) {
 
    dependencies.forEach((state, index)=>{
        if (!state){
            console.warn(`one or more specified %cState%c object must be a ${state}`,"font-weight: bold;   color: orange;","")
        }
        
        state.dependencies.push({func: script, args: args})
        state.invoke(state.dependencies.length - 1)

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


