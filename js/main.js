class ProductInfo {
    constructor(productData) {
        this._name = productData.product_name
        this._ingredients = productData.ingredients
        this._image = productData.image_url
    }
    testCall() {
        console.log(this._ingredients)
    }
    toDOM() {
        const isIt = document.querySelector("#isIt a")
        const tableIngredients = document.querySelector('.ingredients')
        const textArray = []
        const vegArray = []
        // Set product image, name
        document.getElementById("product-image").src = this._image
        document.getElementById("product-name").innerText = this._name
        // Delete old table, keeping table header
        // Re-populate table with product ingredients, vegetarian status
        // (We could make these operations one separate method)
        while (tableIngredients.rows.length > 1) {
            tableIngredients.deleteRow(-1)
        }
        console.log(this._ingredients)
        if (this._ingredients !== null) {
            for (let key in this._ingredients) {
                let ing = this._ingredients[key]
                textArray.push(ing.text)
                let vegStatus = ing.vegetarian == null || ing.vegetarian == "maybe" ? "?" : ing.vegetarian
                vegArray.push(vegStatus)
                let ingIndex = this._ingredients.indexOf(ing)
                const rowIngredient = tableIngredients.insertRow(-1)
                let textCell = rowIngredient.insertCell(0)
                let vegCell = rowIngredient.insertCell(1)
                let ingText = document.createTextNode(ing.text)
                let vegText = document.createTextNode(vegStatus)
                if (vegStatus == "?") {
                    vegCell.classList.add('ing-unknown')
                }
                else if (vegStatus == "no") {
                    vegCell.classList.add('ing-nonvegetarian')
                }
                else {
                    vegCell.classList.add('ing-vegetarian')
                }
                textCell.appendChild(ingText)
                vegCell.appendChild(vegText)
            }
        }
        
        // Determine if ingredients are vegetarian and display result
        if (vegArray.includes("no")) {
            isIt.innerText = "No!"
        }
        else {
            if (vegArray.includes("?")) {
                isIt.innerText = 'Possibly!'
            }
            else {
                isIt.innerText = 'Yes!'
            }
        }
        // Make default hidden table visible
        document.querySelector("table").style.visibility = "visible"
    }
}

function enterInput() {
    const upcQuery = document.getElementById('upc').value
    upcQuery.length === 0 || isNaN(+upcQuery)
        ? highlightValidInput()
        : lookup(upcQuery)    
}

function highlightValidInput() {
    const elementGuideline = document.querySelector('label > span')
    alert(`Please ensure that barcode is 12 digits.`)
    elementGuideline.style.fontWeight = 800
}

function lookup(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.status === 1) {
                    const newProduct = new ProductInfo(data.product)
                    // newProduct.testCall()
                    newProduct.toDOM()
                }
                else {
                    alert(`Product ${barcode} not found. Please try another.`)
                }                
            })
            .catch(err => {
                console.log(`error! ${err}`)
                highlightValidInput()
            });
}