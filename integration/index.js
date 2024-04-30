let lastKnownGradeLength = null;

// Use setInterval to make a request to the LMS platform's GET /grades endpoint every 5 seconds (port 3000)
// If an update is found, make a POST /grades request to the GradeBook platform (port 3001)
setInterval(() => {
    // The LearningManagementSystem API is at port 3000
    fetch('http://localhost:3000/grades')
        .then(res => res.json())
        .then(async (data) => {
            const newGradesCount = data.length - lastKnownGradeLength;

            if (newGradesCount > 0) {
                // Make a request to the Gradebook platform's POST /grades endpoint
                const newGrades = data.slice(data.length - newGradesCount);

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

                lastKnownGradeLength = data.length;
            } else {
                console.info(`No new grades found. Still only ${lastKnownGradeLength} grades.`)
            }
        })
}, 5000)
