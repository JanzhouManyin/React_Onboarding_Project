const priceRegex = RegExp(
    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
);
const formValid = function (formErrors, ...rest) {

    alert(formErrors.name)
    let valid = true;

    if (formErrors.Name.length > 0 || formErrors.Price.length > 0) {
        valid = false;
    }


    return valid;
};

class InsertProduct extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            requiredItem: 0,
            items: [],
            items_name: '',
            item_price: '',
            item_Id: '',
            formErrors: {
                Name: "Name cannot be null",
                Price: "price cannot be null"
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
            case "Price":
                if (value.length == 0) {
                    formErrors.Price = "Price cannot be null";
                } else if (priceRegex.test(value) == false) {
                    formErrors.Price = "Invalid Price Format"
                } else {
                    formErrors.Price = ""
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
                url: "/Product/InsertDataInDatabase",
                data: item,
                success: function (result) {
                    //determing if the Product name already exsts
                    if (result == "no") {
                        alert("This Product is already existing, please input again")
                    } else {
                        alert("Success!..");
                        window.location.href = "/Product/Index";
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
                <button className="ui primary button" data-toggle="modal" data-target="#InsertModal">
                    NewProduct
                </button>

                <div className="modal fade" id="InsertModal" tabIndex="-1" role="dialog" aria-labelledby="InsertModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="InsertModalLabel">Create Product</h5>
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
                                            placeholder="Product Name"
                                            name="Name"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.Name.length > 0 && (
                                            <span className="errorMessage">{formErrors.Name}</span>
                                        )}
                                    </div>

                                    <div className="Price field">
                                        <label htmlFor="Name">Price:</label>
                                        <input
                                            value={this.state.Price}
                                            placeholder="Price"
                                            name="Price"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.Price.length > 0 && (
                                            <span className="errorMessage">{formErrors.Price}</span>
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
    <InsertProduct />,
    document.getElementById('productFormArea')
);