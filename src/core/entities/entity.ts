export abstract class Entity<P> {
    public initialState: P;
    public props: P;

    constructor(data: P) {
        this.initialState = { ...data };
        this.props = { ...data };

        Object.freeze(this.initialState);
    }

    update(data: Partial<P>): void {
        this.props = { ...this.props, ...data };
    }

    commit(): void {
        this.initialState = { ...this.props };
    }
}

/**
 * Lorsqu'une transaction commence (par exemple, une mise à jour du nombre de places),
 * l'état initial de la conference est préservé dans initialState.
 * Cela permet de conserver une copie immuable de l'état initial avant la transaction,
 * agissant comme un point de sauvegarde.
 *
 * Copie immuable de l'état initial :
 * L'utilisation de Object.freeze(this.initialState) garantit que l'état initial de la conference est immuable.
 * Ainsi, elle ne peut pas être modifié après avoir été initialisé.
 * Cela évite les modifications accidentelles de l'état initial et assure que la copie de l'état initial
 * reste constante pendant la durée de la transaction.
 *
 * Rollback en cas d'échec :
 * Si la transaction échoue (par exemple, en raison d'une condition métier non satisfaite),
 * il est possible de revenir à l'état initial de la conference en réaffectant props à initialState.
 * Cela simule une opération de rollback, annulant les changements effectués au cours de la transaction.
 *
 * Commit après le succès de la transaction :
 * Lorsque la transaction réussit, la méthode commit est appelée pour mettre à jour initialState avec les nouvelles valeurs de props.
 * Cela simule une opération de commit, validant les changements effectués au cours de la transaction.
 */
