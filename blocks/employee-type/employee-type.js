import { fetchEmpData } from "../../scripts/scripts.js";

export default function decorate(block) {

    const ulWrap = block.querySelector("ul");
    ulWrap.classList.add("ul-wrap");
    const lastLi = ulWrap.querySelector("li:last-child")
    lastLi.classList.add("last-li");
    

    ulWrap.querySelectorAll("li").forEach((li) => {
        li.classList.add("emp-li");
        const span = document.createElement("span");
        if(!li.classList.contains("last-li")){
            span.appendChild(createDropDown());
            appendSubList(li);
        }
        else{
            span.appendChild(createInputCheckBox());
        }
        li.append(span);
    });

    function createDropDown() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "22");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        // Create arrow path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M6 9l6 6 6-6");

        // Append path to SVG
        svg.appendChild(path);
        return svg;
    }

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


    //by default if nothing is selected then all
    function createInputCheckBox(){
        return `<input type="checkbox" value = ""></input>`
    }

    async function appendSubList(li){
        const sub_ul=document.createElement("ul");
        if(li.innerText="FTE")
            {
                   const response = await fetchEmpData();
                   const info = response.data[0];
                   //unique roles

            uniqueroles.map((role)=>{
                const sub_li = document.createElement("li");
                sub_li.innerText=role;
                const span = document.createElement("span");
                span.appendChild(createCheckBox());
                sub_li.append(span);
                sub_ul.appendChild(sub_li);
            })
        }

    }
    

} 