import "/ecjs.v3.js"

// defines html; w/ html lint extension

const template = /*html*/`

<style>
.responsive-button {
            padding: 15px 30px; /* Top-Bottom, Left-Right Padding */
            font-size: 1rem; /* Base font size */
            color: white; /* Text color */
            background-color: #007bff; /* Button color */
            border: none; /* No border */
            border-radius: 5px; /* Rounded corners */
            cursor: pointer; /* Pointer cursor on hover */
            transition: background-color 0.3s ease; /* Smooth background change */
            width: 100%; /* Full width on small screens */
            height: 100%;
            text-align: center; /* Center text */
        }

        .responsive-button:hover {
            background-color: #0056b3; /* Darker shade on hover */
        }

        @media (max-width: 600px) {
            .responsive-button {
                font-size: 0.9rem; /* Smaller font size on small screens */
            }
        }
    </style>
    <button class="responsive-button" onclick="dom().sayHelloWorld()"></button>
`// dom() will refer to the create component script.

ecjs.createComponent('custom-button', template, 
    (dom, props)=>{ 
        props.someProp //  state variable with initial value based on prop passed; 
        props.buttonName.bind('.responsive-button') // state variable with initial value based on prop passed; also binded to button
        const someString = props.$buttonName // returns buttonName value (log: "Change Image")
        props.buttonName = "Next Image" // changes value of buttonName; automatically changes with binded elements or states
        
        dom.sayHelloWorld = () => {
            alert(`before: ${someString}\nafter: ${props.$buttonName}`)

        }

    }
)

// get parent element based on naming
// make props by simply initializing