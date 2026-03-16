const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");

editBtn.addEventListener("click", function(){

    document.querySelectorAll(".view-mode").forEach(el=>{
        el.style.display = "none";
    });

    document.querySelectorAll(".edit-mode").forEach(el=>{
        el.style.display = "inline-block";
    });

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";

});