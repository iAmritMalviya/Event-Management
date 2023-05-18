const URL = 'http://localhost:3000/api/v3/app/events';

// Fetch data and initialize the page
fetchData();

// Event Handlers
$('#create').on('click', function () {
    resetForm();
    showModal();
});

$('#close').on('click', function () {
    hideModal();
});

$('#submitBtn').off('click').on('click', function (e) {
    e.preventDefault();
    const formData = new FormData($("#form")[0]);
    const id = $(this).val();
    if (id) {
        updateData(id, formData);
    } else {
        createData(formData);
    }
});

// Functions
function fetchData() {
    fetch(URL)
        .then(res => res.json())
        .then(data => {
            console.log(data.responses);
            map.tableMap(data.responses);
            attachEventHandlers();
        })
        .catch(error => {
            console.log(error);
        });
}

function attachEventHandlers() {
    $('.btn-edit').on('click', function () {
        const id = $(this).val();
        showModal();
        fetch(URL + "?Id=" + id)
            .then(res => res.json())
            .then(data => mapping(data.responses[0]))
            .catch(error => {
                console.log(error);
            });
    });

    $('.btn-delete').on('click', async function () {
        const id = $(this).val();
        if (confirm('Are you sure?')) {
            try {
                await deleteData(id);
                location.reload();
                alert('Your data has been deleted');
            } catch (error) {
                console.log(error);
            }
        }
    });
}

function createData(formData) {
    sendRequest(URL, "POST", formData, "Image uploaded successfully", "Error uploading image");
}

function updateData(id, formData) {
    const updateURL = URL + "/" + id;
    sendRequest(updateURL, "PUT", formData, "Image uploaded successfully", "Error uploading image");
}

function deleteData(id) {
    const deleteURL = URL + "/" + id;
    return fetch(deleteURL, { method: 'DELETE' })
        .then(res => res.json())
        .catch(error => {
            console.log(error);
        });
}

function sendRequest(url, method, body, successMsg, errorMsg) {
    fetch(url, {
        method: method,
        body: body
    })
        .then(response => {
            if (response.ok) {
                console.log(successMsg);
            } else {
                console.error(errorMsg);
            }
        })
        .catch(error => {
            console.error("Request failed:", error);
        });
}

function resetForm() {
    $("#submitBtn").val('');
    $("#form")[0].reset();
}

function showModal() {
    $('#modal').css('display', 'block');
}

function hideModal() {
    $('#modal').css('display', 'none');
}

const map = {
    tableMap: (res) => {
        const $container = $(".container");
        const table = $('#table-data');
        if (res.length === 0) {
            $container.empty().append('No Data found');
            return;
        }

        let li = `<tr>
            <th>Name</th>
            <th>Schedule</th>
            <th>Category</th>
            <th>Action</th>
        </tr>`;

        res.forEach(data => {
            let formattedDate = new Date(data.schedule).toLocaleDateString();
            
            li += `<tr>
                <td>${data.name}</td>
                <td>${formattedDate}</td>        
                <td>${data.category}</td>        
                <td><button type='button' value=${data._id} class='btn-edit'>EDIT</button> / <button type='button' value=${data._id} class='btn-delete'>DELETE</button></td>                
            </tr>`;
        });

        table.empty().append(li);
    }
};

function mapping(data) {
    console.log(data);
    $('#name').val(data.name);
    $('#tagline').val(data.tagline);
    $('#description').val(data.description);
    $('#category').val(data.category);
    $('#sub_category').val(data.sub_category);
    $('#rigor_rank').val(data.rigor_rank);
    $('#schedule').val(data.schedule);
    $('#attendees').val(data.attendees);
    $('#moderator').val(data.moderator);
    $("#submitBtn").val(data._id);
}
