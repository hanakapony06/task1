const express = require('express');
const app=express()
const fs = require('fs');
app.use(express.json());
app.listen(3000,()=>{
    console.log('server is running on port 3000')
});



const loadStudents = () => {
    const rawData = fs.readFileSync('students.json', 'utf-8');

    return JSON.parse(rawData);
};

const saveStudents = (students) => {
    fs.writeFileSync('students.json', JSON.stringify(students, null, 2), 'utf-8');
};

app.get('/students', (req, res) => {
    let students = loadStudents();
    res.send(students);
});

app.post('/students',(req,res)=>{
    let students =loadStudents();
const emailexists=students.some(student=>student.email===req.body.email);
if(emailexists){
    return res.status(400).send({error:"email already exists"});
}
const newid = students.length && students[students.length - 1].id 
              ? students[students.length - 1].id + 1 
              : 1;

    const newstudent ={id:newid,...req.body};
    students.push(newstudent);
    saveStudents(students)
    res.send(newstudent);
})

app.delete('/students/:id',(req,res)=>{
    let students=loadStudents();
    const id=parseInt(req.params.id);
    const studentExists = students.some(student => student.id === id);

    if (!studentExists) {
        return res.status(404).send({ error: "Student not found!" })};
    students = students.filter(student => student.id !== id);
    saveStudents(students);
    res.send({ message: "Student deleted successfully!" });
})

app.patch('/students/:id',(req,res)=>{
    let students=loadStudents();
    const id = parseInt(req.params.id);
    const index=students.findIndex(student=>student.id===id);
    if (index === -1) {
        return res.status(404).send({ error: "Student not found!" });
    }
    students[index]={...students[index],...req.body};
    saveStudents(students);
    res.send({massege:"updated successfully"})
})