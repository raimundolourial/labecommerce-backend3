// console.log('Log do arquivo "process-argv.js"');

const loopArguments = (array) => {
    for (let i = 0; i < array.length; i++) {
        console.log('----');
        console.log(` ${array[i]} é o ${i + 1}º argumento`);
        console.log('----');
    }
};

loopArguments(process.argv);
