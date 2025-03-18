export default function decorate(block){
  block.querySelector("ul").classList.add("exp-ul");

  const ulWrap = block.querySelector("ul");
 
  

  ulWrap.querySelectorAll("li").forEach((li) => {
      li.classList.add("emp-li");
      const span = document.createElement("span");
      span.innerHTML=createInputCheckBox(li.innerText);
      li.append(span);

  });

//   function createCheckBox() {
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
function createInputCheckBox(innerText){
  
  return `<input type="checkbox" value = "${innerText}" class="experience-checkbox"></input>`
}



const filterBtn = document.querySelector(".experience-container").lastElementChild;
const btnTxt = filterBtn.querySelector("p").innerText;
const btn = document.createElement("button");
btn.innerText=btnTxt;
filterBtn.innerHTML="";
filterBtn.appendChild(btn);
filterBtn.classList.add("filter-btn");

block.querySelectorAll(".experience-checkbox").forEach((exp)=>
{
  exp.addEventListener("change",(event) => {
    console.log(event.target.value +"is checked" + event.target.checked)

  })
}
)


  
}