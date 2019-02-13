Create database Onborading_db;

use Onborading_db
 Create Table Customer(
Id int identity(1,1),
Name varchar(50) not null,
Address varchar(50) not null,
PRIMARY KEY( Id )
);

use Onborading_db
Create Table Product(
Id int identity(1,1),
Name varchar(50) not null,
Price float not null,
PRIMARY KEY( Id )
);

use Onborading_db
Create Table Store(
Id int identity(1,1),
Name varchar(50) not null,
Address varchar(50) not null,
PRIMARY KEY( Id )
);

use Onborading_db
Create Table ProductSold(
Id int identity(1,1),
ProductId int FOREIGN KEY REFERENCES Product(Id) not null,
CustomerId int FOREIGN KEY REFERENCES Customer(Id) not null,
StoreId int FOREIGN KEY REFERENCES Store(Id) not null,
DataSold Date not null,
PRIMARY KEY( Id )
);