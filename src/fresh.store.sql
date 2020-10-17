CREATE TABLE "categories" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "products" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"category_id"	INTEGER,
	"unit_price"	REAL NOT NULL,
	"unit"	TEXT,
	"buy_price"	REAL NOT NULL,
	"archived"	INTEGER NOT NULL DEFAULT 0,
	"in_store_quantity"	REAL NOT NULL DEFAULT 0.0,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("category_id") REFERENCES "categories"("id")
);

CREATE TABLE "agencies" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"address"	TEXT,
	"phone_numbers"	TEXT,
	"notes"	TEXT,
	"archived"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "cheques" (
	"id"	INTEGER NOT NULL UNIQUE,
	"serial_number"	TEXT NOT NULL UNIQUE,
	"area"	TEXT NOT NULL,
	"bank"	TEXT NOT NULL,
	"branch"	TEXT NOT NULL,
	"date"	TEXT NOT NULL,
	"amount"	REAL NOT NULL,
	"notes"	TEXT,
	"payer_name"	TEXT NOT NULL,
	"status"	TEXT NOT NULL DEFAULT 'مراجعة',
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "employees" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"address"	TEXT,
	"sellary"	REAL NOT NULL,
	"job_start_date"	TEXT,
	"phone_numbers"	TEXT,
	"job"	TEXT,
	"notes"	INTEGER,
	"archived"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "money_transactions" (
	"id"	INTEGER NOT NULL UNIQUE,
	"date"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"employee_id"	INTEGER NOT NULL,
	"amount"	REAL NOT NULL,
	"notes"	TEXT,
	FOREIGN KEY("employee_id") REFERENCES "employees"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "orders" (
	"id"	INTEGER NOT NULL UNIQUE,
	"date"	TEXT NOT NULL,
	"agency_id"	INTEGER NOT NULL,
	"total_bill"	REAL NOT NULL,
	"discount"	REAL NOT NULL,
	"agent_name"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"notes"	TEXT,
	"employee_id"	INTEGER NOT NULL,
	"payed"	REAL NOT NULL DEFAULT 0.0,
	FOREIGN KEY("agency_id") REFERENCES "agencies"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "order_payment" (
	"id"	INTEGER NOT NULL UNIQUE,
	"order_id"	INTEGER NOT NULL,
	"status"	TEXT,
	"type"	TEXT,
	"cheque_id"	INTEGER DEFAULT NULL,
	"date"	TEXT NOT NULL,
	"note"	TEXT,
	"amount"	REAL NOT NULL,
	FOREIGN KEY("order_id") REFERENCES "orders"("id"),
	FOREIGN KEY("cheque_id") REFERENCES "cheques"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "order_product" (
	"id"	INTEGER NOT NULL UNIQUE,
	"order_id"	INTEGER NOT NULL,
	"product_id"	INTEGER NOT NULL,
	"quantity"	REAL NOT NULL,
	"price"	REAL NOT NULL,
	"discount"	REAL NOT NULL DEFAULT 0.0,
	"buy_price"	REAL NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("order_id") REFERENCES "orders"("id"),
	FOREIGN KEY("product_id") REFERENCES "products"("id")
);


-- indexes

CREATE INDEX "agency_archive" ON "agencies" (
	"archived"	ASC
)

CREATE UNIQUE INDEX "agency_id" ON "agencies" (
	"id"	ASC
)

CREATE UNIQUE INDEX "category_id" ON "categories" (
	"id"	ASC
)

CREATE UNIQUE INDEX "cheque_id" ON "cheques" (
	"id"	ASC
)

CREATE INDEX "employee_archived" ON "employees" (
	"archived"	ASC
)

CREATE UNIQUE INDEX "employee_id" ON "employees" (
	"id"	ASC
)

CREATE INDEX "money_transaction_employee" ON "money_transactions" (
	"employee_id"	ASC
)

CREATE INDEX "money_transaction_type" ON "money_transactions" (
	"type"	ASC
)

CREATE UNIQUE INDEX "money_transactions_id" ON "money_transactions" (
	"id"	ASC
)

CREATE INDEX "order_agency" ON "orders" (
	"agency_id"	ASC
)

CREATE INDEX "order_employee" ON "orders" (
	"employee_id"	ASC
)

CREATE UNIQUE INDEX "order_id" ON "orders" (
	"id"	ASC
)

CREATE UNIQUE INDEX "order_payment_id" ON "order_payment" (
	"id"	ASC
)

CREATE INDEX "order_payment_order" ON "order_payment" (
	"order_id"	ASC
)

CREATE UNIQUE INDEX "order_product_id" ON "order_product" (
	"id"	ASC
)

CREATE INDEX "order_product_order" ON "order_product" (
	"order_id"	ASC
)

CREATE INDEX "order_product_product" ON "order_product" (
	"product_id"	ASC
)

CREATE INDEX "order_type" ON "orders" (
	"type"	ASC
)

CREATE INDEX "product_archived" ON "products" (
	"archived"	ASC
)

CREATE INDEX "product_category" ON "products" (
	"category_id"	ASC
)

CREATE UNIQUE INDEX "product_id" ON "products" (
	"id"	ASC
)

