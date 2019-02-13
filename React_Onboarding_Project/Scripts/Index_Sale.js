//Regular expression
const dateRegex = RegExp(
    /(^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$)/
); 
//validation
const formValid = function (formErrors, ...rest) {    
    let valid = true;

    if (formErrors.ProductId.length > 0 || formErrors.CustomerId.length > 0 || formErrors.StoreId.length > 0 || formErrors.DataSold.length > 0) {
        valid = false;
    }
    return valid;
};
//set Button component
class PageButton extends React.Component {
    constructor(props) {
        super(props);
        this.setNext = this.setNext.bind(this);
        this.setUp = this.setUp.bind(this);
        this.state = {
            num: 0,
            pagenum: this.props.current//set current page
        }
    }

    //Nextpage
    setNext() {
        if (this.state.pagenum < this.props.totalPage) {
            this.setState({
                num: this.state.num + this.props.pageSize,
                pagenum: this.state.pagenum + 1
            }, function () {
                console.log(this.state)
                this.props.pageNext(this.state.num)
            })
        }
    }

    //Previous page
    setUp() {
        if (this.state.pagenum > 1) {
            this.setState({
                num: this.state.num - this.props.pageSize,
                pagenum: this.state.pagenum - 1
            }, function () {
                console.log(this.state)
                this.props.pageNext(this.state.num)
            })
        }
    }

    render() {
        return (
            <ul>
                <li onClick={this.setUp} >Previous</li>
                <li className="activePage">{this.state.pagenum}/{this.props.totalPage}</li>
                <li onClick={this.setNext}>Next</li>

            </ul>
        );
    }
}
//set Insert component
class InsertSaleModal extends React.Component {
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
    //get the data for the downlist 
    componentDidMount() {
        //search products
        $.get("/Sale/GetProductList", function (data) {
            this.setState({
                products_list: data
            });
        }.bind(this));
        //search customers
        $.get("/Sale/GetCustomerList", function (data) {
            this.setState({
                customers_list: data
            });
        }.bind(this));
        //search store
        $.get("/Sale/GetStoreList", function (data) {
            this.setState({
                stores_list: data
            });
        }.bind(this));
    }
    //set the change value and validate values in front
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
         //validate Name
        switch (name) {
            case "ProductId":
                if (value.length == 0) {
                    formErrors.ProductId = "Product cannot be null";
                } else {
                    formErrors.ProductId = ""
                }
                break;
            //validate Customer
            case "CustomerId":
                if (value.length == 0) {
                    formErrors.CustomerId = "Customer cannot be null";
                } else {
                    formErrors.CustomerId = ""
                }
                break;
            //validate Store
            case "StoreId":
                if (value.length == 0) {
                    formErrors.StoreId = "Store cannot be null";
                } else {
                    formErrors.StoreId = ""
                }
                break;
            //validate Date
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
    //submit function
    handleSubmit(e) {
        e.preventDefault();
        const item = this.state;
        $.ajax({
            type: "Post",
            url: "/Sale/InsertDataInDatabase",
            data: item,
            success: function (result) {
                //determing if the Sale record name already exsts
                alert("Insert Success!");
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
                                    <div className="Date field">
                                        <div><label htmlFor="Name">DateSold:</label><span>(Format:YYYY-MM-DD)</span></div>                                 
                                        <input
                                            value={this.state.DataSold}
                                            placeholder="DateSold"
                                            name="DataSold"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
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
//set Update component
class UpdateSaleModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            id: "",
            ProductId: '',
            CustomerId: '',
            StoreId: '',
            DataSold:'',
            products_list: [],
            customers_list: [],
            stores_list: [],
            formErrors: {
                ProductId: '',
                CustomerId: '',
                StoreId: '',
                DataSold:''                 
            }
        }
    }
    //get the value from the listbox
    componentWillReceiveProps(nextProps) {
        var DateSold = moment(nextProps.DataSold).format('YYYY-MM-DD')
        this.setState({
            id:nextProps.id,
            ProductId: nextProps.ProductId,
            CustomerId: nextProps.CustomerId,
            StoreId: nextProps.StoreId,
            DataSold: DateSold
        })
         
    }
    //get the data for the downlist 
    componentDidMount() {
        //search products
        $.get("/Sale/GetProductList", function (data) {
            this.setState({
                products_list: data
            });
        }.bind(this));
         //search customers
        $.get("/Sale/GetCustomerList", function (data) {
            this.setState({
                customers_list: data
            });
        }.bind(this));
         //search stores
        $.get("/Sale/GetStoreList", function (data) {
            this.setState({
                stores_list: data
            });
        }.bind(this));

    }
    //set the change value and validate values in front
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;     
        let formErrors = this.state.formErrors;
        
        switch (name) {
            //validate Product
            case "ProductId":
                if (value.length == 0) {
                    formErrors.ProductId = "Product cannot be null";
                } else {
                    formErrors.ProductId = ""
                }                
                break;
            //validate Customer
            case "CustomerId":
                if (value.length == 0) {
                    formErrors.CustomerId = "Customer cannot be null";
                } else {
                    formErrors.CustomerId = ""
                }
                break;
            //validate Store
            case "StoreId":
                if (value.length == 0) {
                    formErrors.StoreId = "Store cannot be null";
                } else {
                    formErrors.StoreId = ""
                }
                break;
             //validate Date
            case "DataSold":
                if (value.length == 0) {
                    formErrors.DataSold = "DataSold cannot be null";
                } else if (dateRegex.test(value) == false) {
                    formErrors.DataSold = "Invalid Date Format"
                } else {
                    formErrors.DataSold = ""
                }
                break;      
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    }
    //submit function
    handleSubmit(e) {
        e.preventDefault();
        //validate the form values for the controllor 
        var formErrors = this.state.formErrors;
        var validate = formValid(formErrors);
        if (validate) {
            const item = this.state;             
            $.ajax({
                type: "Post",
                url: "/Sale/UpdateDataInDatabase",
                data: item,
                success: function (result) {
                    //determing if the Sale record already exsts
                    alert("Update Success!...");
                    window.location.href = "/Sale/Index";
                }
            })
        } else {
            alert("Please inupt again")
        }
    }
    render() {
        const { formErrors } = this.state;
        return (
            <div>
                <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateModalLabel">Create Customer</h5>
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
                                                name="ProductId"
                                                value={this.state.ProductId}
                                                onChange={this.handleChange}
                                                required
                                            >
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
                                                name="CustomerId"
                                                value={this.state.CustomerId}
                                                onChange={this.handleChange}
                                                required
                                            >
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
                                                name="StoreId"
                                                value={this.state.StoreId}
                                                onChange={this.handleChange}
                                                required
                                            >
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

                                    <div className="Date field">
                                        <div><label htmlFor="Name">DateSold:</label><span>(Format:YYYY-MM-DD)</span></div>
                                        <input
                                            value={this.state.DataSold}
                                            placeholder="DateSold"
                                            name="DataSold"
                                            noValidate
                                            onChange={this.handleChange}
                                        />
                                        {formErrors.DataSold.length > 0 && (
                                            <span className="errorMessage">{formErrors.DataSold}</span>
                                        )}
                                    </div>

                                    <div className="modal-footer">
                                        <button className="ui black button" data-dismiss="modal">Cancle</button>
                                        <button className="ui green button">Update Product</button>
                                         
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
 
class SaleListBox extends React.Component {
    constructor(props) {
        super(props);
        this.pageNext = this.pageNext.bind(this);
        this.setPage = this.setPage.bind(this);
        this.state = {
            indexList: [],//data for the current page
            items: [],
            totalData: [],
            current: 1, //the currentpage
            pageSize: 5, //Number of sheets displayed per page
            goValue: 0,
            totalPage: 0,//total page
            item_Id: '',
            item_ProductId: '',
            item_CustomerId: '',
            item_StoreId: '',
            item_DataSold: ''
        };

    }
    //get total data and set the data for state 
    componentWillMount() {
        $.get("/Sale/GetSaleData", function (data) {

            this.setState({
                totalData: data,
                totalPage: Math.ceil(data.length / this.state.pageSize),
                indexList: data.slice(this.state.goValue, this.state.goValue + this.state.pageSize)
            });
        }.bind(this));
         
    }
    //get the changing data when click the edit button
    replaceModalItem(index, ProductId, CustomerId, StoreId, DataSold) {
        this.setState({
            item_Id: index,
            item_ProductId: ProductId,
            item_CustomerId: CustomerId,
            item_StoreId: StoreId,
            item_DataSold: DataSold            
        });
    }
    //delete function
    handleDelete(SaleId) {
        $.ajax({
            type: "POST",
            url: "/Sale/DeleteSaleRecord?SaleId=" + SaleId,
            success: function (result) {
                alert("Delete Success!....");
                window.location.href = "/Sale/Index";
            }
        })
    }
   
     //set the data for page
    setPage(num) {

        this.setState({
            indexList: this.state.totalData.slice(num, num + this.state.pageSize)
        })

    }
    //set data for next page
    pageNext(num) {
        this.setPage(num)
    }

    render() {
        //set the data for each page
        const rows = this.state.indexList.map((item) => {
            var index = item.Id;
            var DateSold = moment(item.DataSold).format('YYYY-MM-DD')
            return (
                <tr key={index}>
                    <td>{item.ProductName}</td>
                    <td>{item.CustomerName}</td>
                    <td>{item.StoreName}</td>
                    <td>{DateSold}</td>
                    <td><button className="ui yellow button" data-toggle="modal" data-target="#updateModal" onClick={() => this.replaceModalItem(index, item.ProductId, item.CustomerId, item.StoreId, item.DataSold)}>EDIT</button></td>
                    <td><button className="ui negative button" data-toggle="modal" data-target="#deleteModal" onClick={() => this.replaceModalItem(index, item.ProductId, item.CustomerId, item.StoreId, item.DataSold)}>DELETE</button></td>
                </tr>
            )
        });

        let item_Id = this.state.item_Id;
        let item_ProductId = this.state.item_ProductId;
        let item_CustomerId = this.state.item_CustomerId;
        let item_StoreId = this.state.item_StoreId;
        let item_DataSold = this.state.item_DataSold;


        return (
            <div>
                <button className="ui primary button" data-toggle="modal" data-target="#InsertModal">
                    NewSaleRecord
                </button>

                <div className="table-container">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Customer</th>
                                <th>Store</th>
                                <th>Date</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <div className="page-container" >
                    <PageButton {...this.state} pageNext={this.pageNext} />

                </div>

                <InsertSaleModal />
                <UpdateSaleModal id={item_Id} ProductId={item_ProductId} CustomerId={item_CustomerId}
                    StoreId={item_StoreId} DataSold={item_DataSold} />

                <div className="modal fade" id="deleteModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <a href="#" className="close" data-dismiss="modal">&times;</a>
                                <h4>Delete Sale Record</h4>
                            </div>
                            <div className="modal-body">
                                <h4>Are You Sure? You Want To Delete This Record.</h4>
                            </div>
                            <div className="modal-footer">
                                <a href="#" className="ui black button" data-dismiss="modal" id="r">Cancle</a>
                                <button className="ui red button" onClick={() => this.handleDelete(item_Id)}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

ReactDOM.render(
    <SaleListBox dataUrl="/Sale/GetSaleData" />,
    document.getElementById('Sale_main')
);