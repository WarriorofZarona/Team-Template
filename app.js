const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const managerQuestions = [{
    type: "input",
    message: "Enter the manager's name: ",
    name: "managerName"
},
{
    type: "input",
    message: "Enter the manager's email: ",
    name: "managerEmail"
}, {
    type: "input",
    message: "Enter the office number: ",
    name: "managerOfficeNum"
}];

const employeeQuestions = [{
    type: "confirm",
    message: "Would you like to add an Employee?",
    name: "addEmployee"
},
{
    type: "input",
    message: "Enter the employee's name: ",
    name: "employeeName",
    when: answers => answers.addEmployee
}, {
    type: "input",
    message: "Enter the employee's email: ",
    name: "employeeEmail",
    when: answers => answers.addEmployee
},
{
    type: "list",
    message: "Please choose the employee's role: ",
    choices: ["Engineer", "Intern"],
    name: "role",
    when: answers => answers.addEmployee
},
{
    type: "input",
    message: "Please enter the Github username: ",
    name: "github",
    when: answers => answers.role === "Engineer"
},
{
    type: "input",
    message: "Please enter the school: ",
    name: "school",
    when: answers => answers.role === "Intern"
}]

getManagerInfo = async (currentId) => {

    let manager;

    try {
        await inquirer.prompt(managerQuestions)
            .then(answers => {
                const managerName = answers.managerName;
                const managerEmail = answers.managerEmail;
                const managerOfficeNum = answers.managerOfficeNum;
                manager = new Manager(managerName, currentId, managerEmail, managerOfficeNum);

            })
    } catch (err) {
        console.log(err);
    }
    return manager;
}

getEmployeeInfo = async (currentId, team) => {
    try {
        await inquirer
            .prompt(employeeQuestions)
            .then(data => {
                currentId++
                const employeeName = data.employeeName;
                const employeeEmail = data.employeeEmail;
                const employeeRole = data.role;
                if (employeeRole == "Engineer") {
                    const employeeGithub = data.github;
                    const employee = new Engineer(employeeName, currentId, employeeEmail, employeeGithub)
                    team.push(employee);
                } else if (employeeRole == "Intern") {
                    const employeeSchool = data.school;
                    const employee = new Intern(employeeName, currentId, employeeEmail, employeeSchool)
                    team.push(employee);
                }
                if (data.addEmployee) {
                    console.log("So far, our team looks like this: ")
                    console.log(team);
                    return getEmployeeInfo(currentId, team);
                } else {
                    console.log("All employees added!");
                    console.log("The following team was created")
                    console.log(team)
                }
            })
    } catch (err) {
        console.log("ERROR!")
        console.log(err);
    }
    return team;
}


init = async () => {
    let currentId = 1;
    let team = [];
    const managerInfo = await getManagerInfo(currentId)
    console.log("The following is the manager info")
    console.log(managerInfo);
    team.push(managerInfo);
    const employeeInfo = await getEmployeeInfo(currentId, team);
    const renderHTML = await render(employeeInfo);
    fs.writeFile(outputPath, renderHTML, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("The team.html file has been successfully written!");
        }
    });
};

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
