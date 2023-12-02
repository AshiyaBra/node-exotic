const getFruits = async() => {
    try{
        return (await fetch("/api/fruits/")).json();
    }catch(error){
        console.log(error);
    }
};

const showFruits = async() => {
    let fruits = await getFruits();
    let fruitsDiv = document.getElementById("fruits-list");
    fruitsDiv.innerHTML = "";
    fruits.forEach((fruit) => {
        const section = document.createElement("section");
        section.classList.add("fruit");
        fruitsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        h3 = document.createElement("h3");
        h3.innerHTML = fruit.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = fruit.img;
        section.append(img);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(fruit);
        };
    });
};

const displayDetails = (fruit) => {
    const fruitDetails = document.getElementById("fruit-details");
    fruitDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = "	 &#x2715;";
    fruitDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    fruitDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = `<strong>Name: </strong> ${fruit.name}`;
    fruitDetails.append(h3);

    const color = document.createElement("p");
    color.innerHTML = `<strong>Color: </strong> ${fruit.color}`;
    fruitDetails.append(color);

    const family = document.createElement("p");
    family.innerHTML = `<strong>Family: </strong> ${fruit.family}`;
    fruitDetails.append(family);

    const place = document.createElement("p");
    place.innerHTML = `<strong>Place: </strong> ${fruit.place}`;
    fruitDetails.append(place);

    const growth = document.createElement("p");
    growth.innerHTML = `<strong>Growth: </strong> ${fruit.growth}`;
    fruitDetails.append(growth);

    const ul = document.createElement("ul");
    fruitDetails.append(ul); 
    console.log(fruit.place);
    fruit.place.forEach((place) => { 
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = place;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("title").innerHTML = "Edit Exotic Fruit";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteFruit(fruit);
    };

    populateEditForm(fruit); 
};

const deleteFruit = async (fruit) => {
    let response = await fetch(`/api/fruits/${fruit._id}`, { 
        method: "DELETE",
        headers: {
        "Content-Type": "application/json;charset=utf-8",
        },
  });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showFruits();
    document.getElementById("fruit-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (fruit) => {
    const form = document.getElementById("add-edit-fruit-form");
    form._id.value = fruit._id;
    form.name.value = fruit.name;
    form.color.value = fruit.color;
    form.family.value = fruit.family;
    populatePlace(fruit);
    form.growth.value = fruit.growth;
    
};

const populatePlace = (fruit) => {
    const section = document.getElementById("place-boxes");
    fruit.places.forEach((place) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = place;
        section.append(input);
    });
};

const addEditFruit = async(e) => {
    e.preventDefault();
    const form =  document.getElementById("add-edit-fruit-form");
    const formData = new FormData(form);
   
    let fruit;
    formData.append("place", getExoticFruits());
    if(form._id.value == -1){
        formData.delete("_id");
        
        console.log(...formData);

        response = await fetch("/api/fruits", {
            method: "POST",
            body: formData,
        });

    }

    else {

        console.log(...formData);

        response = await fetch(`/api/fruits/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
    }

    if(response.status != 200){
        console.log("Posting Error");
    }

    fruit = await response.json();

    if (form._id.value != -1) {
        displayDetails(fruit);
    }
    
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showFruits();
};

const getExoticFruits = () => {
    const inputs = document.querySelectorAll("#place-boxes input");
    let places = [];

    inputs.forEach((input) => {
        places.push(input.value);
    });

    return places;
};

const addPlace = (e) => {
    e.preventDefault();
    const section = document.getElementById("place-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

const resetForm = () => {
    const form = document.getElementById("add-edit-fruit-form");
    form.reset();
    form._id.value = "-1";
    document.getElementById("place-boxes").innerHTML="";
    
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("title").innerHTML = "Add Exotic Fruit";
    resetForm();
};




window.onload = () => {
    showFruits();
    document.getElementById("add-edit-fruit-form").onsubmit = addEditFruit;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-place").onclick= addPlace;
};
