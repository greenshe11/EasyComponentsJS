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
    <button class="responsive-button">Click Me!</button>

`

ecjs.createComponent('custom-button', template, 
    (dom, vars)=>{
        vars.button = dom.useState(dom.getAttribute("text")).bind('.responsive-button')
        dom.onclick = useState()
        
        useEffect(()=>{
            dom.select('.responsive-button').onclick = dom.onclick.current
        }, [dom.onclick])

    }
)
