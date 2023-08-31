const startGame = (chooseUser) => {
    // => VERIFICAR SE O USUÁRIO DIGITOU UM DOS TRÊS ARGUMENTOS ACEITOS:
    if (
        chooseUser !== 'pedra' &&
        chooseUser !== 'papel' &&
        chooseUser !== 'tesoura'
    ) {
        console.log('Por favor, digite "pedra", "papel" ou "tesoura"');
        return;
    }

    // => SORTEAR A OPÇÃO DO COMPUTADOR:
    const options = ['pedra', 'papel', 'tesoura'];
    const randomIndex = Math.floor(Math.random() * options.length);
    const chooseComputer = options[randomIndex];

    // => ANALISANDO EMPATE:
    if (chooseUser === chooseComputer) {
        console.log(
            `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Empate!`
        );
        return;
    }

    // => USUÁRIO -> PEDRA | COMPUTER -> PAPEL
    if (chooseUser === 'pedra') {
        if (chooseComputer === 'papel') {
            console.log(
                `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você perdeu!`
            );
            return;
        }
        // => USUÁRIO -> PEDRA | COMPUTER -> TESOURA
        console.log(
            `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você ganhou!`
        );
        return;

        // => USUÁRIO -> PAPEL | COMPUTER -> TESOURA
    } else if (chooseUser === 'papel') {
        if (chooseComputer === 'tesoura') {
            console.log(
                `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você perdeu!`
            );
            return;
        }
        // => USUÁRIO -> PAPEL | COMPUTER -> PEDRA
        console.log(
            `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você ganhou!`
        );
        return;
    }

    // => USUÁRIO -> TESOURA  | COMPUTER -> PEDRA
    if (chooseComputer === 'pedra') {
        console.log(
            `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você perdeu!`
        );
        return;
    }
    // => USUÁRIO -> TESOURA | COMPUTER -> PAPEL
    console.log(
        `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}. Você ganhou!`
    );
    return;
};
startGame(process.argv[2]);
