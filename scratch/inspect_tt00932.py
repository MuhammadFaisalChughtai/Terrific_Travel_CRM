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
    SELECT id, "bookingReference", "totalPrice", "paidAmount", "remainingAmount", "paymentStatus", "refundAmount"
    FROM "Booking"
    WHERE "bookingReference" = 'TT00932';
""")

booking = cur.fetchone()
print("BOOKING TT00932:", booking)

if booking:
    booking_id = booking[0]
    cur.execute("""
        SELECT id, amount, "paymentMethod", notes, "createdAt", "paidOn"
        FROM "BookingTransaction"
        WHERE "bookingId" = %s;
    """, (booking_id,))
    txs = cur.fetchall()
    print("BOOKING TRANSACTIONS:")
    for tx in txs:
        print("  ", tx)

    cur.execute("""
        SELECT id, amount, provider, status, "createdAt"
        FROM "Payment"
        WHERE "bookingId" = %s;
    """, (booking_id,))
    pmts = cur.fetchall()
    print("PAYMENTS RECORD:")
    for p in pmts:
        print("  ", p)

cur.close()
conn.close()
