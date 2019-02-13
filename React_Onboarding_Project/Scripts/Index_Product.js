//Regular expression
const priceRegex = RegExp(
    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
);
//validation
const formValid = function (formErrors, ...rest) {
    let valid = true;

    if (formErrors.Name.length > 0 || formErrors.Price.length > 0) {
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
class InsertProductModal extends React.Component {
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
    //set the change value and validate values in front
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        //validate Name
        switch (name) {
            case "Name":
                if (value.length < 3 && value.length > 0) {
                    formErrors.Name = "minimum 3 characaters required";
                } else if (value.length == 0) {
                    formErrors.Name = "Name cannot be null";
                } else {
                    formErrors.Name = ""
                }
                break;
            //validate Price
            case "Price":
                if (value.length == 0) {
                    formErrors.Price = "Price cannot be null";
                } else if (priceRegex.test(value) == false) {
                    formErrors.Price = "Invalid Price Format"
                } else {
                    formErrors.Price = ""
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
                url: "/Product/InsertDataInDatabase",
                data: item,
                success: function (result) {
                    //determing if the Product name already exists
                    if (result == "no") {
                        alert("This Product is already existing, please input again")
                    } else {
                        alert("Insert Success!..");
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
//set Update component
class UpdateProductModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            id: '',
            Name: '',
            Price: '',
            formErrors: {
                Name: "",
                Price: ""
            }
        }
    }
    //set the change value and validate values in front
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
         //validate Name
        switch (name) {
            case "Name":
                if (value.length < 3 && value.length > 0) {
                    formErrors.Name = "minimum 3 characaters required";
                } else if (value.length == 0) {
                    formErrors.Name = "Name cannot be null";
                } else {
                    formErrors.Name = ""
                }
                break;
             //validate Price
            case "Price":
                if (value.length == 0) {
                    formErrors.Price = "Price cannot be null";
                } else if (priceRegex.test(value) == false) {
                    formErrors.Price = "Invalid Price Format"
                } else {
                    formErrors.Price = ""
                }
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));

    }
    //get the value from the listbox
    componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.id,
            Name: nextProps.Name,
            Price: nextProps.Price,
        });
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
                url: "/Product/UpdateDataInDatabase",
                data: item,
                success: function (result) {
                    //determing if the Product name already exists
                    alert("Update Success!...");
                    window.location.href = "/Product/Index";
                }
            })
        } else {
            alert("Please inupt again")
        }
    }
    render() {
        const { formErrors } = this.state;
        return (
            <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateModalLabel">Edit Product</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form className="ui form" onSubmit={this.handleSubmit} noValidate>
                                <div className="Name field">
                                    <label htmlFor="Name">Name:</label>
                                    <input
                                        value={this.state.Name}
                                        name="Name"
                                        noValidate
                                        onChange={this.handleChange}
                                    />
                                    {formErrors.Name.length > 0 && (
                                        <span className="errorMessage">{formErrors.Name}</span>
                                    )}

                                </div>
                                <div className="Price field">
                                    <label htmlFor="Price">Price:</label>
                                    <input
                                        value={this.state.Price}
                                        name="Price"
                                        noValidate
                                        onChange={this.handleChange}
                                    />
                                    {formErrors.Price.length > 0 && (
                                        <span className="errorMessage">{formErrors.Price}</span>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="ui black button" data-dismiss="modal">Close</button>
                                    <button type="submit" className="ui green button">Update Product</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
//set List component
class ProductListBox extends React.Component {
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
            item_name: '',
            item_price: 0,
            item_Id: 0
        };

    }
    //get total data and set the data for state 
    componentWillMount() {
        $.get(this.props.dataUrl, function (data) {
            this.setState({
                totalData: data,
                totalPage: Math.ceil(data.length / this.state.pageSize),
                indexList: data.slice(this.state.goValue, this.state.goValue + this.state.pageSize)
            });
        }.bind(this));
        
    }
    //get the changing data when click the edit button
    replaceModalItem(index, Name, Address) {
        this.setState({
            item_name: Name,
            item_price: Address,
            item_Id: index             
        });
    }
    //delete function
    handleDelete(ProductId) {
        $.ajax({
            type: "POST",
            url: "/Product/DeleteProductRecord?ProductId=" + ProductId,
            success: function (result) {
                 //determing if the Customer is already existing in productsold
                if (result == "use") {
                    alert("This Product has been already used, please check the sale page!");
                    window.location.href = "/Product/Index";
                } else {
                    alert("Delete Success!..");
                    window.location.href = "/Product/Index";
                }
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
            return (
                <tr key={index}>
                    <td>{item.Name}</td>
                    <td><span>$</span>{item.Price}</td>
                    <td><button className="ui yellow button" data-toggle="modal" data-target="#updateModal" onClick={() => this.replaceModalItem(index, item.Name, item.Price)}>EDIT</button></td>
                    <td><button className="ui negative button" data-toggle="modal" data-target="#deleteModal" onClick={() => this.replaceModalItem(index, item.Name, item.Price)}>DELETE</button></td>
                </tr>
            )
        });

        let modal_Name = this.state.item_name;
        let item_price = this.state.item_price;
        let item_Id = this.state.item_Id;

        return (
            <div>
                <button className="ui primary button" data-toggle="modal" data-target="#InsertModal">
                    NewProduct
                </button>

                <div className="table-container">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
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

                <InsertProductModal />
                <UpdateProductModal Name={modal_Name} Price={item_price} id={item_Id} />

                <div className="modal fade" id="deleteModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <a href="#" className="close" data-dismiss="modal">&times;</a>
                                <h4>Delete Product Record</h4>
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
    <ProductListBox dataUrl="/Product/GetProductData" />,
    document.getElementById('Product_main')
);