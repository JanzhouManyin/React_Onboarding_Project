class SearchSale extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            items: [],
            item_Id: '',
            item_ProductId: '',
            item_CustomerId: '',
            item_StoreId: '',
            item_DataSold: ''



        }
    }

    replaceModalItem(index, ProductId, CustomerId, StoreId, DataSold) {


        this.setState({
            item_Id: index,
            item_ProductId: ProductId,
            item_CustomerId: CustomerId,
            item_StoreId: StoreId,
            item_DataSold: DataSold
            // requiredItem: index
        });
    }

    componentDidMount() {
        $.get(this.props.dataUrl, function (data) {

            this.setState({
                items: data
            });


        }.bind(this));

    }

    handleDelete(SaleId) {


        // alert(SaleId);
        $.ajax({
            type: "POST",
            url: "/Sale/DeleteSaleRecord?SaleId=" + SaleId,

            success: function (result) {
                //      alert(result);
                window.location.href = "/Sale/Index";
            }
        })



    }

    render() {
        const rows = this.state.items.map((item) => {
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

                <UpdateModal id={item_Id} ProductId={item_ProductId} CustomerId={item_CustomerId}
                    StoreId={item_StoreId} DataSold={item_DataSold} />

                <div className="modal fade" id="deleteModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <a href="#" className="close" data-dismiss="modal">&times;</a>
                                <h4>Delete Customer Record</h4>
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

        )
    }

}