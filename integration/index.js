// Check how many grades are in the GradeBook platform (port 3001)
fetch('http://localhost:3001/grades')
    .then(res => res.json())
    .then(gradebookGrades => {
        let gradebookGradeCount = gradebookGrades.length;

        // Use setInterval to make a request to the LMS platform's GET /grades endpoint every 5 seconds (port 3000)
        // If an update is found, make a POST /grades request to the GradeBook platform (port 3001)
        setInterval(() => {
            // The LearningManagementSystem API is at port 3000
            fetch('http://localhost:3000/grades')
                .then(res => res.json())
                .then(async (lmsGrades) => {
                    const newGradesCount = lmsGrades.length - gradebookGradeCount;

                    if (newGradesCount > 0) {
                        // Make a request to the Gradebook platform's POST /grades endpoint
                        const newGrades = lmsGrades.slice(lmsGrades.length - newGradesCount);

                        console.info("THERE HAVE BEEN SOME CHANGES!")
                        console.info(`I SEE ${newGradesCount} NEW GRADES!`)
                        // The GradeBook API is at port 3001
                        await fetch('http://localhost:3001/grades', {
                            method: 'POST',
                            body: JSON.stringify(newGrades),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        gradebookGradeCount = lmsGrades.length;
                    } else {
                        console.info(`No new grades found. Still only ${gradebookGradeCount} grades.`)
                    }
                })
        }, 5000)
    })
