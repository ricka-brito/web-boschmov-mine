const optionMenu = document.querySelector(".dropdown")
const selectBtn = optionMenu.querySelector(".select-btn")
const options = optionMenu.querySelectorAll(".option")
const sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"))

options.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOPtion = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOPtion
        console.log(selectedOPtion)
    })
})
