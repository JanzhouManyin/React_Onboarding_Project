const dateRegex = RegExp(
    /(^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$)/
);

const formValid = function (formErrors, ...rest) {

    let valid = true;

    if (formErrors.ProductId.length > 0 || formErrors.CustomerId.length > 0 || formErrors.StoreId.length > 0 || formErrors.DataSold.length > 0) {
        valid = false;
    }
    return valid;
};

class InsertSaledown extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            ProductId: '',
            products_list: [],
            customers_list: [],
            stores_list: [],
            formErrors: {
                ProductId: 'Product cannot be null',
                CustomerId: 'Customer cannot be null',
                StoreId: 'Store cannot be null',
                DataSold: 'DateSold cannot be null'
            }

        }
    }
    componentDidMount() {

        $.get("/Sale/GetProductList", function (data) {
            this.setState({
                products_list: data
            });
        }.bind(this));

        $.get("/Sale/GetCustomerList", function (data) {
            this.setState({
                customers_list: data
            });
        }.bind(this));

        $.get("/Sale/GetStoreList", function (data) {
            this.setState({
                stores_list: data
            });
        }.bind(this));

    }

    handleChange(e) {

        e.preventDefault();
        const { name, value } = e.target;

        let formErrors = this.state.formErrors;

        switch (name) {
            case "ProductId":
                if (value.length == 0) {
                    formErrors.ProductId = "Product cannot be null";
                } else {
                    formErrors.ProductId = ""
                }
                break;
            case "CustomerId":
                if (value.length == 0) {
                    formErrors.CustomerId = "Customer cannot be null";
                } else {
                    formErrors.CustomerId = ""
                }
                break;
            case "StoreId":
                if (value.length == 0) {
                    formErrors.StoreId = "Store cannot be null";
                } else {
                    formErrors.StoreId = ""
                }
                break;
            case "DataSold":
                if (value.length == 0) {
                    formErrors.DataSold = "Store cannot be null";
                } else if (dateRegex.test(value) == false) {
                    formErrors.DataSold = "Invalid Price Format"
                } else {
                    formErrors.DataSold = ""
                }
                break;


        }


        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    }

    handleSubmit(e) {
        e.preventDefault();
      
        const item = this.state;
         
        $.ajax({
            type: "Post",
            url: "/Sale/InsertDataInDatabase",
            data: item,
            success: function (result) {
                //determing if the Customer name already exsts
                alert("success!");
                window.location.href = "/Sale/Index";
            },
            error(e) {
                console.log(e);
                alert('Error! Please try again');
            }

        })

    }

    render() {
        const { formErrors } = this.state;
        return (
            <div>
                <button className="ui primary button" data-toggle="modal" data-target="#InsertModal">
                    NewSale
                </button>

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
                                <form className="ui form" onSubmit={this.handleSubmit}>
                                    <div className="form-group row">
                                        <label className="control-label col-md-12" htmlFor="Product">Product</label>
                                        <div className="col-md-4">
                                            <select
                                                className="form-control"
                                                data-val="true"
                                                name="ProductId"
                                                value={this.state.productId}
                                                onChange={this.handleChange}
                                                required>
                                                <option value="">-- Select Product --</option>
                                                {this.state.products_list.map(product =>
                                                    <option key={product.Id} value={product.Id}>{product.Name}</option>
                                                )}
                                            </select>
                                            {formErrors.ProductId.length > 0 && (
                                                <span className="errorMessage">{formErrors.ProductId}</span>
                                            )}
                                        </div>
                                    </div >

                                    <div className="form-group row">
                                        <label className="control-label col-md-12" htmlFor="Customer">Customer</label>
                                        <div className="col-md-4">
                                            <select
                                                className="form-control"
                                                data-val="true"
                                                name="CustomerId"
                                                value={this.state.CustomerId}
                                                onChange={this.handleChange}
                                                required>
                                                <option value="">-- Select Customer --</option>
                                                {this.state.customers_list.map(customer =>
                                                    <option key={customer.Id} value={customer.Id}>{customer.Name}</option>
                                                )}
                                            </select>
                                            {formErrors.CustomerId.length > 0 && (
                                                <span className="errorMessage">{formErrors.CustomerId}</span>
                                            )}
                                        </div>
                                    </div >

                                    <div className="form-group row">
                                        <label className="control-label col-md-12" htmlFor="Store">Store</label>
                                        <div className="col-md-4">
                                            <select
                                                className="form-control"
                                                data-val="true"
                                                name="StoreId"
                                                value={this.state.StoreId}
                                                onChange={this.handleChange}
                                                required>
                                                <option value="">-- Select Store --</option>
                                                {this.state.stores_list.map(store =>
                                                    <option key={store.Id} value={store.Id}>{store.Name}</option>
                                                )}
                                            </select>
                                            {formErrors.StoreId.length > 0 && (
                                                <span className="errorMessage">{formErrors.StoreId}</span>
                                            )}
                                        </div>
                                    </div >
                                    <div className="form-group row">
                                        <label htmlFor="Name">DateSold:</label>
                                        <input
                                            value={this.state.DataSold}
                                            placeholder="DateSold"
                                            name="DataSold"
                                            noValidate
                                            onChange={this.handleChange}
                                        /><span>(YYYY-MM-DD)</span>
                                        {formErrors.DataSold.length > 0 && (
                                            <span className="errorMessage">{formErrors.DataSold}</span>
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
    <InsertSaledown />,
    document.getElementById('saleFormArea')
);