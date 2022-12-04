{
    function fixTable() {
        const table = document.querySelector('table');

        table.removeChild(table.querySelector('colgroup'));

        // Change column header text and remove the arrow.
        tableHead = table.querySelector('thead');

        tableHead.querySelector('tr').classList.add('indexhead');
        tableHead.querySelector('th').classList.add('indexcolname');
        tableHead.querySelector('th').children[0].innerHTML = "Name";
        arrowIcon = tableHead.querySelector('th').children[1];
        tableHead.querySelector('th').removeChild(arrowIcon);

        // Add link to parent directory
        tableBody = table.querySelector('tbody');
        parentRow = document.createElement('tr');
        parentRow.appendChild(document.createElement('td'));
        parentRow.querySelector('td').appendChild(document.createElement('a'));
        parentRow.querySelector('td').querySelector('a').href = '../';
        parentRow.querySelector('td').querySelector('a').innerHTML = 'Parent Directory';

        tableBody.insertBefore(parentRow, tableBody.firstElementChild);

        // Remove date and size columns and add icons.
        const rows = Array.from(table.querySelectorAll('tr'));
        rows.forEach((row) => {
            row.children[0].classList.add('indexcolname');

            const nameColumn = row.children[0];

            // Skip the first tbody row.
            if (row.children.length > 1) {
                const sizeColumn = row.children[1];
                const dateColumn = row.children[2];

                // Remove the columns.
                row.removeChild(sizeColumn);
                row.removeChild(dateColumn);
            }

            // Asign custom icons by reading the URI.
            const image = document.createElement('img');

            link = nameColumn.querySelector('a').href;

            if (nameColumn.querySelector('a').innerHTML === 'Parent Directory') {
                image.setAttribute('src', './theme/icons/back.svg');
            } else if (link.endsWith('/')) {
                image.setAttribute('src', './theme/icons/file-directory.svg');
            } else if (link.endsWith('.txt')) {
                image.setAttribute('src', './theme/icons/file-text.svg');
            } else if (link.endsWith('.pdf')) {
                image.setAttribute('src', './theme/icons/file-pdf.svg');
            } else {
                image.setAttribute('src', './theme/icons/blank.gif');
            }

            if (!image) {
                return;
            }

            // Wrap icon in a div.img-wrap.
            const div = document.createElement('div');
            div.className = 'img-wrap';
            div.appendChild(image);

            //iconColumn.appendChild(div);

            // Insert icon before filename.
            nameColumn.insertBefore(div, nameColumn.firstElementChild);
        });
    }


    function addTitle() {
        let path = window.location.pathname.replace(/\/$/g, '');
        let titleText;
        const pathSplits = path.split('/');

        if (pathSplits.length > 2) {
            titleText = 'Exámenes de ' + decodeURIComponent(
                pathSplits[pathSplits.length - 1].replace(/-|_/g, ' ')
            );
        } else {
            titleText = 'Titulaciones';
        }

        const container = document.createElement('div');
        container.id = 'page-header';
        const h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode(titleText));
        container.appendChild(h1);
        const mainContainer = document.getElementById('main-container');

        mainContainer.insertBefore(container, mainContainer.getElementsByTagName('table')[0]);
        document.title = titleText;
    }

    /**
     * Get the value and unit to use for RelativeTimeFormat.
     * @param {number} seconds Difference in seconds between two dates.
     */
    function getTimeFormatArgs(seconds) {
        const absoluteSeconds = Math.abs(seconds);
        if (absoluteSeconds > 60 * 60 * 24 * 365) {
            return { value: seconds / (60 * 60 * 24 * 365), unit: 'year' };
        }

        if (absoluteSeconds > 60 * 60 * 24 * 30) {
            return { value: seconds / (60 * 60 * 24 * 30), unit: 'month' };
        }

        if (absoluteSeconds > 60 * 60 * 24) {
            return { value: seconds / (60 * 60 * 24), unit: 'day' };
        }

        if (absoluteSeconds > 60 * 60) {
            return { value: seconds / (60 * 60), unit: 'hour' };
        }

        if (absoluteSeconds > 60) {
            return { value: seconds / 60, unit: 'minute' };
        }

        return { value: seconds, unit: 'second' };
    }

    /**
     * Convert the date output from the server to a Date instance.
     * @param {string} str Date string from the server.
     * @return {Date | null}
     */
    function getDateFromString(str) {
        if (!str) {
            return null;
        }

        // 2014-12-09 10:43 -> 2014, 11, 09, 10, 43, 0.
        const parts = str.split(' ');
        const day = parts[0].split('-');
        const timeOfDay = parts[1].split(':');
        const year = parseInt(day[0], 10);
        const month = parseInt(day[1], 10) - 1;
        const _day = parseInt(day[2], 10);
        const hour = parseInt(timeOfDay[0], 10);
        const minutes = parseInt(timeOfDay[1], 10);

        return new Date(year, month, _day, hour, minutes, 0);
    }

    function addSearch() {
        const input = document.createElement('input');
        input.type = 'search';
        input.id = 'search';
        input.setAttribute('placeholder', 'Buscar');
        document.getElementById('page-header').appendChild(input);

        const sortColumns = Array.from(document.querySelectorAll('thead a'));
        const nameColumns = Array.from(document.querySelectorAll('tbody .indexcolname'));
        const rows = nameColumns.map(({ parentNode }) => parentNode);
        const fileNames = nameColumns.map(({ textContent }) => textContent);

        function filter(value) {
            // Allow tabbing out of the search input and skipping the sort links
            // when there is a search value.
            sortColumns.forEach((link) => {
                if (value) {
                    link.tabIndex = -1;
                } else {
                    link.removeAttribute('tabIndex');
                }
            });

            // Test the input against the file/folder name.
            let even = false;
            fileNames.forEach((name, i) => {
                if (!value || name.toLowerCase().includes(value.toLowerCase())) {
                    const className = even ? 'even' : '';
                    rows[i].className = className;
                    even = !even;
                } else {
                    rows[i].className = 'hidden';
                }
            });
        }

        document.getElementById('search').addEventListener('input', ({ target }) => {
            filter(target.value);
        });

        filter('');
    }

    fixTable();
    addTitle();
    addSearch();
}