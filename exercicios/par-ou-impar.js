const startGame = (chooseUser, Usernumber) => {
    // => VERIFICA SE TEMA ARGUMENTO 1 E 2:
    if (chooseUser !== 'par' || (chooseUser !== 'impar' && Usernumber < 0)) {
        console.log(
            'Por favor digite:"par" ou "impar" um espaço e depois um número qualquer'
        );
        return;
    }

    // => SORTEIA UM NÚMERO:
    const drawnNumber = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
    const total = drawnNumber + Number(Usernumber);

    // => VERIFICA SE NÚMERO SORTEADO É PAR OU IMPAR:
    const checkNumberDrawer = total % 2 === 0 ? 'par' : 'impar';

    // => VERIFICA SE COMPUTADOR FICOU COM PAR OU IMPAR:
    const chooseComputer = chooseUser === 'par' ? 'impar' : 'par';

    // => VERIFICA E ANUNCIA VITÓRIA:
    checkNumberDrawer === chooseUser
        ? console.log(
              `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}, o resultado foi ${total}. Você ganhou!`
          )
        : console.log(
              `Você escolheu ${chooseUser} e o computador escolheu ${chooseComputer}, o resultado foi ${total}. Você perdeu!`
          );
};

startGame(process.argv[2], process.argv[3]);
