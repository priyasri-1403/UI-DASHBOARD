import { fetchEmpData } from "../../scripts/scripts.js";

export default async function decorte(block){
    
    const skillLink  = block.querySelector("div");
    skillLink.innerHTML="";
    const ul_wrap = document.createElement("ul");
    ul_wrap.className="ul-wrap";
    //get all the skills
    
    const response = await fetchEmpData();
    const info = response.data[0];
    console.log(info);

    const nonskills = ["Resource Name", "Email", "Role", "Manager", "UI Experience(Years)"];
    const skills = Object.keys(info).filter((key)=>!nonskills.includes(key));

    // function createCheckBox() {
    //     const svgNS = "http://www.w3.org/2000/svg";
    
    //     // Create SVG element
    //     const svg = document.createElementNS(svgNS, "svg");
    //     svg.setAttribute("width", "22");
    //     svg.setAttribute("height", "19");
    //     svg.setAttribute("viewBox", "0 0 24 24");
    //     svg.setAttribute("fill", "none");
    //     svg.setAttribute("stroke", "currentColor");
    //     svg.setAttribute("stroke-width", "2");
    //     svg.setAttribute("stroke-linecap", "round");
    //     svg.setAttribute("stroke-linejoin", "round");
    
    //     // Create the checkbox (square box)
    //     const rect = document.createElementNS(svgNS, "rect");
    //     rect.setAttribute("x", "2");
    //     rect.setAttribute("y", "2");
    //     rect.setAttribute("width", "20");
    //     rect.setAttribute("height", "20");
    //     rect.setAttribute("rx", "4"); // Rounded corners (optional)
    //     svg.appendChild(rect);
    
    //     // // Create the checkmark (✓)
    //     // const checkmark = document.createElementNS(svgNS, "path");
    //     // checkmark.setAttribute("d", "M6 12l4 4 8-8"); // Checkmark path
    //     // svg.appendChild(checkmark);
    
    //     return svg;
    // }
    
    function createInputCheckBox(value){
        return `<input class="skill-checkbox" type="checkbox" value = ${value}></input>`
    }
    skills.map((skill) => {
        const li = document.createElement("li");
        li.innerText=skill;
        const span = document.createElement("span");
        span.innerHTML=createInputCheckBox(skill);
        li.append(span);
        ul_wrap.appendChild(li);
    })
    skillLink.appendChild(ul_wrap);

    block.querySelectorAll(".skill-checkbox").forEach((skill) => {
        skill.addEventListener("change", (event) => {
            console.log(`${event.target.value} is ${event.target.checked ? "checked" : "unchecked"}`);
        });
    });
    

    
    


}