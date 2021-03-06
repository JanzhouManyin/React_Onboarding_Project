﻿const formValid = function (formErrors, ...rest) {
    alert(formErrors.name)
    let valid = true;

    if (formErrors.Name.length > 0 || formErrors.Address.length > 0) {
        valid = false;
    }


    return valid;
};

class InsertCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            requiredItem: 0,
            items: [],
            items_name: '',
            item_address: '',
            item_Id: '',
            formErrors: {
                Name: "Name cannot be null",
                Address: "Address cannot be null"
            }

        }
    }



    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;


        switch (name) {
            case "Name":

                if (value.length < 3 && value.length > 0) {
                    formErrors.Name = "minimum 3 characaters required";
                } else if (value.length == 0) {
                    formErrors.Name = "Name cannot be null";
                } else {
                    formErrors.Name = ""
                }

                //formErrors.Name =
                //    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
            case "Address":
                if (value.length < 3 && value.length > 0) {
                    formErrors.Address = "minimum 3 characaters required";
                } else if (value.length == 0) {
                    formErrors.Address = "Address cannot be null";
                } else {
                    formErrors.Address = ""
                }
                //formErrors.Address =
                //    value.length < 3 ? "minimum 3 characaters required" : "";
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    }
    handleSubmit(e) {
        e.preventDefault();


        var formErrors = this.state.formErrors;
        var validate = formValid(formErrors);

        if (validate) {
            const item = this.state;

            $.ajax({
                type: "Post",
                url: "/Customer/InsertDataInDatabase",
                data: item,
                success: function (result) {
                    //determing if the Customer name already exsts
                    if (result == "no") {
                        alert("This Customer is already existing, please input again")
                    } else {
                        alert("Success!..");
                        window.location.href = "/Customer/Index";
                    }

                },
                error(e) {
                    console.log(e);
                    alert('Error! Please try again');
                }

            })
        } else {
            alert("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    }



    render() {
        const { formErrors } = this.state;
        return (
            <div>

                <div className="modal fade" id="InsertModal" tabIndex="-1" role="dialog" aria-labelledby="InsertModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="InsertModalLabel">Create Customer</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="ui form" onSubmit={this.handleSubmit} noValidate>
                                    <div className="Name field">
                                        <label htmlFor="Name">Name:</label>
                                        <input
                                            className={formErrors.Name.length > 0 ? "error" : null}
                                            value={this.state.Name}
                                            placeholder="Customer Name"
                                            name="Name"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.Name.length > 0 && (
                                            <span className="errorMessage">{formErrors.Name}</span>
                                        )}
                                    </div>

                                    <div className="Address field">
                                        <label htmlFor="Name">Address:</label>
                                        <input
                                            value={this.state.Address}
                                            placeholder="Address"
                                            name="Address"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.Address.length > 0 && (
                                            <span className="errorMessage">{formErrors.Address}</span>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button className="ui black button" data-dismiss="modal">Cancle</button>
                                        <button className="ui primary button">Create</button>
                                    </div>
                                </form>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }

}




ReactDOM.render(
    <InsertCustomer dataUrl="/Customer/SaveData" />,
    document.getElementById('Customer_main')
);