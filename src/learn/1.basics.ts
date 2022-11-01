import { log, delimeterMsg, logF } from '../util';

function basicCommands() {
  log(`
    Why PosgreSQL:
    - Object relational database that is keeping the SQL standarts
    - Excels at concurrency
    - Superior at avoiding data corruption
    - Custom Data Types, Operators & Index types
    - Extensible, Scalable & protects your data

    Installations:
    - See docker-compose for details
    - 2 containers: postgres and pgadmin
    - run "docker-compose up", then open "localhost:5050", enter "admin@admin.com/root"
    - create a new server, use "postgres-learn-postgres-1" as an ip address, test_db and root/root

    Basic commands:
    - use "\\l" to list databases (similar to show databases())
    - use "\\c <db_name>" to connect to a database (similar to use database <db_name>)
    - use "\\dt" to show tables (similar to show tables())
    - use "\\d" to describe a table (similar to desc <table_name>)
    
    Data types:
    - strings: char(5) up to 5 characters, varchar(20) 20 characters, text any text length
    - auto increment: smallserial 1 to 32,767, serial, bigserial
    - numbers: smallint -32,768 to 32,767, integer, bigint, decimal 131072 whole digits and 16383 after decimal, numeric, real, double, float
    - boolean: true(True, 1, t, y, yes, on), false(False, 0, f, n, no, off) or null
    - date/time: date, time, ampm, time zone support, timestamp, intervals
    - currency, binary, json, range, geometric, arrays, xml, uuid, and even custom data types
  `);
}

function creatingTables() {
  log(`Creating a table:
    create table customer (
      first_name varchar(30) not null,
      last_name varchar(30) not null,
      email varchar(60) not null,
      company varchar(30) not null,
      street varchar(50) not null,
      city varchar(40) not null,
      state char(2) not null,
      zipcode smallint not null,
      phone varchar(20) not null,
      birthdate date null,
      sex char(1) not null,
      date_entered timestamp not null,
      id serial primary key);

    Inserting a record:
    insert into customer(first_name, last_name, email, company, street, city, state, zipcode, phone, birthdate, sex, date_entered) values
    ('Christopher', 'Jones', 'christopherjones@bp.com', 'BP', '347 Cedar str', 'Lawrencewille', 'GA', '30044', '348-848-9281', '1938-09-11', 'M', current_timestamp);

    Creating a custom type:
    Create type sex_type as enum ('M', 'F');

    Altering a table:
    alter table customer alter column sex type sex_type using sex::sex_type;

    Creating other tables:
    create table sales_person (
      first_name varchar(30) not null,
      last_name varchar(30) not null,
      email varchar(60) not null,
      company varchar(30) not null,
      street varchar(50) not null,
      city varchar(40) not null,
      state char(2) not null default 'PA',
      zipcode smallint not null,
      phone varchar(20) not null,
      birthdate date null,
      sex char(1) not null,
      date_hired timestamp not null,
      id serial primary key);

    create table product_type (
      name varchar(30) not null,
      id serial primary key);

    create table product (
      type_id integer references product_type(id),
      name varchar(30) not null,
      supplier varchar(30) not null,
      description text not null,
      id serial primary key);

    create table item (
      product_id integer references product(id),
      size integer not null,
      color varchar(30) not null,
      picture varchar(256) not null,
      price numeric(6,2) not null,
      id serial primary key);

    create table sales_order (
      cust_id integer references customer(id),
      sales_person_id integer references sales_person(id),
      time_order_taken timestamp not null,
      purchase_order_number integer not null,
      credit_card_number varchar(16) not null,
      credit_card_exper_month smallint not null,
      credit_card_exper_day smallint not null,
      credit_card_secret_code smallint not null,
      name_on_card varchar(100) not null,
      id serial primary key);

    create table sales_item (
      item_id integer references item(id),
      sales_order_id integer references sales_order(id),
      quantity integer not null,
      discount numeric(6,2) not null default 0,
      taxable boolean not null default false,
      sales_tax_rate numeric(5,2) not null default 0,
      id serial primary key);

    create table transaction_type(
      name varchar(30) not null,
      payment_type varchar(30) not null,
      id serial primary key);

    alter table sales_item add day_of_week varchar(8);
    alter table sales_item alter column day_of_week set not null;
    alter table sales_item rename column day_of_week to weekday;
    alter table sales_item drop column weekday;
    alter table transaction_type rename to transaction;
    create_index transaction_id on transaction(name);
    truncate table transaction;
    drop table transaction;

    insert into product_type(name) values ('Business');
    select * from product_type;
    insert into product values (1, 'Grandview', 'Allen edmonds', 'Big description here');
    alter table customer alter column zipcode type integer;
  `);
}

function aggregationsAndJoins() {
  log(`Aggregations:
    SELECT * FROM sales_item WHERE discount > .15 order by discount desc limit 5;
    select concat(first_name, ' ', last_name) as name, phone, state from customer where state = 'TX';
    select product_id, sum(price) as total from item where product_id=1 group by product_id;
    select distinct state from customer where state in ('CA', 'NJ') order by state;
    
    Joins:
    select item_id, price from item
    inner join sales_item on item.id = sales_item.id
    order by item_id;
    
    SELECT sales_order.id, sales_item.quantity, item.price, 
    (sales_item.quantity * item.price) AS Total
    FROM sales_order
    JOIN sales_item
    ON sales_item.sales_order_id = sales_order.id
    JOIN item
    ON item.id = sales_item.item_id
    ORDER BY sales_order.id;

    select name, supplier, price from product
    left join item on item.product_id = product.id
    order by name;

    select sales_order_id, quantity, product_id
    from item cross join sales_item
    order by sales_order_id;

    Unions:
    select first_name, last_name, street, city, zip, birth_date from customer
    where extract(month from birth_date) = 12
    union
    select first_name, last_name, street, city, zip, birth_date from sales_person
    where extract(month from birth_date) = 12
    order by birth_date;
  `);
}

function comparations() {
  log(`Comparations:
    select product_id, price from item where price is not null;
    select first_name, last_name from customer where first_name similar to 'D%' or last_name similar to '%n';
    select first_name, last_name from customer where first_name ~ '^ma.$';
  `);
}

function grouping() {
  log(`Grouping:
    select product_id, price from item where price is not null;
    select first_name, last_name from customer where first_name similar to 'D%' or last_name similar to '%n';
    select first_name, last_name from customer where first_name ~ '^ma.$';

    select extract(month from birth_date) as month, count(*) as amount from customer
    select count(*) as items, sum(price) as value, round(avg(price), 2) as avg, min(price) as min, max(price) as max from item;
    group by month having count(*) > 1 order by month;
  `);
}

function views() {
  log(`Views:
    Views are select statements thats result is stored in your database. Let's create a view that contains our main purchase order info.

    CREATE VIEW purchase_order_overview AS
    SELECT sales_order.purchase_order_number, customer.company, 
    sales_item.quantity, product.supplier, product.name, item.price, 
    --Cannot use total if you want this to be updated Fix Below
    (sales_item.quantity * item.price) AS Total,
    --Remove concat if you want this to be updatable 
    CONCAT(sales_person.first_name, ' ', sales_person.last_name) AS Salesperson
    FROM sales_order     -- Join some tables
    JOIN sales_item
    ON sales_item.sales_order_id = sales_order.id    -- Tables go together by joining on sales order id
    -- Any time you join tables you need to find foreign and primary keys that match up
    JOIN item
    ON item.id = sales_item.item_id    -- Join item as well using matching item id
    JOIN customer
    ON sales_order.cust_id = customer.id    // Join customer using customer ids
    JOIN product
    ON product.id = item.product_id
    JOIN sales_person
    ON sales_person.id = sales_order.sales_person_id
    ORDER BY purchase_order_number;

    When data in the database is updated so is the view. You can use the view in all the same ways you can a regular table.
    If you want it to be updatable though it cannot include DISTINCT, UNION, Aggregate Functions, GROUP BY or HAVING.

    SELECT * FROM purchase_order_overview;

    Recalculate Total
    If we removed total above so it could be updated we can just calculate with total like this
    SELECT *, (quantity * price) AS Total FROM purchase_order_overview;

    Drop a View
    DROP VIEW purchase_order_overview;
  `);
}

export default function basics() {
  delimeterMsg('BASICS');
  logF(basicCommands);
  logF(creatingTables);
  logF(aggregationsAndJoins);
  logF(comparations);
  logF(grouping);
  logF(views);
}
