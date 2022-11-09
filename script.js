//tous les tr de tableBody
const tableBodyTrs = document.querySelector(".tableBody").querySelectorAll(".tr");

function createForm() {
    //créer une form et ajouter les évènements de submit après
    let form = document.createElement("form");
    form.innerHTML = `
    <th>
    <input type="text" class="orange" placeholder="Enter day">
    </th>
    <td>
        <input type="time" class="green" id="start-work">
    </td>
    <td>
        <input type="time" class="blue" id="start-break">
    </td>
    <td>
        <input type="time" class="blue" id="end-break">
    </td>
    <td>
        <input type="time" class="green" id="end-work">
    </td>
    <td>
        <input class="workedHours purple" value ="00:00" disabled>
    </td>
    <td>
        <button class="btn" type="submit">Add</button>
    </td>
    `
    form.onsubmit = (event) => handleFormSubmission(event)

    return form;
}

//remplir chaque élt tr avec des forms
(async () => {
    tableBodyTrs.forEach(tr => tr.appendChild(createForm()))
})();

const forms = document.querySelectorAll("form");

function handleFormSubmission(e) {
    e.preventDefault();
    //récupérer les infos correspondants à chaque ligne
    const day = e.target.children[0].value;
    const startWork = e.target.children[1].value;
    const startBreak = e.target.children[2].value;
    const endBreak = e.target.children[3].value;
    const endWork = e.target.children[4].value;
    let worked = e.target.children[5];
    let submitBtn = e.target.children[6];


    //validation
    if (validateSubmission(day, startWork, endWork, submitBtn, startBreak, endBreak)) {
        //calculer les heures de travail journalières
        worked.value = calcDailyWorkedHours(startWork, endWork, startBreak, endBreak);
        //calculer toutes les heures de travail
        calculateTotalWorkedHours()
    }
}

function validateSubmission(day, startWork, endWork, submitBtn, startBreak, endBreak) {
    //si on a pas rentré de jour ou d'heure de début ou d'heure de fin
    if (!day || !startWork || !endWork) {
        alert("You need to enter a day and a start and end hour !")
    }
    //si on a une pause pas complète
    else if ((startBreak || endBreak) && !(startBreak && endBreak)) {
        alert("You need to specify the start and the end of your break!")
    }
    else if (startWork > endWork || startBreak > endBreak) {
        alert("Enter valid hours !")
    }
    else {
        submitBtn.classList.add("btn-green");
        submitBtn.innerHTML = "&#10004";
        return true;
    }
}

function calcDailyWorkedHours(startWork, endWork, startBreak, endBreak) {
    //transformer les heures en array
    const startWorkArray = startWork.split(":")
    const endWorkArray = endWork.split(":")
    const startBreakArray = startBreak.split(":")
    const endBreakArray = endBreak.split(":")

    //transformer les heures en dates
    const startWorkDate = new Date(0, 0, 0, startWorkArray[0], startWorkArray[1], 0)
    const endWorkDate = new Date(0, 0, 0, endWorkArray[0], endWorkArray[1], 0)
    const startBreakDate = new Date(0, 0, 0, startBreakArray[0], startBreakArray[1], 0)
    const endBreakDate = new Date(0, 0, 0, endBreakArray[0], endBreakArray[1], 0)

    //work Time    
    const diffWork = endWorkDate.getTime() - startWorkDate.getTime();

    //break Time
    const diffBreak = endBreakDate.getTime() - startBreakDate.getTime();

    let diffFinal = (isNaN(diffWork) ? 0 : diffWork) - (isNaN(diffBreak) ? 0 : diffBreak);

    //diffFinal est en millisecondes, avoir en heure = diffFinal/3600/1000
    const hours = Math.floor(diffFinal / 1000 / 3600);

    //avoir les minutes : enlever les heures au temps complet et récupérer le reste qui est le temps en millisecondes
    diffFinal -= hours * 1000 * 3600;

    //le convertir en minutes = diffFinal/1000/60
    const minutes = Math.floor(diffFinal / 1000 / 60);

    return (hours < 9 ? "0" : "")
        + hours + ":" + (minutes < 9 ? "0" : "") + minutes
}

function calculateTotalWorkedHours() {
    const allWorkedHours = document.querySelectorAll(".workedHours")

    //on récupère tous les input de classe "workedHours" et on les range dans un tableau puis on range les valeurs contenues dans ces input dans un tableau
    let workedHoursArray = Array.from(allWorkedHours)
    let newWorkedHours = workedHoursArray.map(workedHour => workedHour.value)

    //tableau des heures converties en minutes (des nombres)
    let convertedHours = newWorkedHours.map(el => {
        const [hours, minutes] = el.split(":")
        return parseInt(hours) * 60 + parseInt(minutes)
    })
    console.log(convertedHours)

    //sommer toutes les heures et afficher la somme
    let calculateTotalHoursWorked = convertedHours.reduce(
        (accumulateur, valeurCourante) => (accumulateur + valeurCourante)
    )
    console.log(calculateTotalHoursWorked)

    document.getElementById("totalWorkedHours").value = minutesToHoursAndMinutes(calculateTotalHoursWorked)
}

function minutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return (hours + "").padStart(2, "0") + ":" + (mins + "").padStart(2, "0")
    //.padstart pour compléter avec des 0 si la chaine ne contient pas 2 caracteres
}