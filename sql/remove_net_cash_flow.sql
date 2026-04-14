IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'daily_revenue'
      AND COLUMN_NAME = 'net_cash_flow'
)
BEGIN
    ALTER TABLE daily_revenue
    DROP COLUMN net_cash_flow;
END;
