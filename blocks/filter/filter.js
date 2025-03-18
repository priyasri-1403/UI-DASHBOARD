export default function decorate(block){
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
  
    // Create filter icon path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3 4h18l-7 10v6l-4 2v-8L3 4z");
  
    // Append path to SVG
    svg.appendChild(path);
    const filter_wrap = block.firstElementChild.querySelector("div");
    filter_wrap.className="filter-wrap";
    filter_wrap.prepend(svg);

}