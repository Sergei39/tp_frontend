export class BoardComponent {
    #parent;
    #data;

    constructor({
        parent = document.body,
        data = [],
    } = {}) {
        this.#parent = parent;
        this.#data = data;
    }
    render() {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
        <tr>
            <th>Email</th>
            <th>Age</th>
            <th>Likes</th>
        </tr>
        `;
        const tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);
        table.border = 1;
        table.cellSpacing = table.cellSpacing = 0;

        this.#data.forEach((user) => {
            const email = user.email;
            const age = user.age;
            const score = user.score;

            const tr = document.createElement('tr');
            const tdEmail = document.createElement('td');
            const tdAge = document.createElement('td');
            const tdScore = document.createElement('td');

            tdEmail.textContent = email;
            tdAge.textContent = age;
            tdScore.textContent = score;

            tr.appendChild(tdEmail);
            tr.appendChild(tdAge);
            tr.appendChild(tdScore);

            tbody.appendChild(tr);

            this.#parent.appendChild(table);
        });
    }
}