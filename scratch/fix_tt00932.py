import psycopg2

conn = psycopg2.connect(
    dbname="tms_db",
    user="tms_user",
    password="tms_password",
    host="localhost",
    port=5432
)
cur = conn.cursor()

cur.execute("""
    UPDATE "Booking"
    SET "paidAmount" = 11600.0,
        "remainingAmount" = 0.0,
        "paymentStatus" = 'PAID',
        "fullyPaidAt" = NOW()
    WHERE "bookingReference" = 'TT00932';
""")

conn.commit()
print("Successfully updated TT00932 booking financial status to PAID!")

cur.execute("""
    SELECT id, "bookingReference", "totalPrice", "paidAmount", "remainingAmount", "paymentStatus"
    FROM "Booking"
    WHERE "bookingReference" = 'TT00932';
""")
print("Updated Row:", cur.fetchone())

cur.close()
conn.close()
