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
    WHERE "totalPrice" = 11600 OR "paidAmount" = 8600 OR "paidAmount" = 11600;
""")

rows = cur.fetchall()
print("BOOKINGS MATCHING:")
for r in rows:
    print(r)
    booking_id = r[0]
    cur.execute("""
        SELECT id, amount, "paymentMethod", notes, "createdAt", "paidOn"
        FROM "BookingTransaction"
        WHERE "bookingId" = %s;
    """, (booking_id,))
    txs = cur.fetchall()
    print("  TRANSACTIONS:")
    for tx in txs:
        print("   ", tx)

cur.close()
conn.close()
