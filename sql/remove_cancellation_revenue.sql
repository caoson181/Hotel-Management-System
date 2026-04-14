IF EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'daily_revenue'
      AND COLUMN_NAME = 'cancellation_revenue'
)
BEGIN
    ALTER TABLE daily_revenue
    DROP COLUMN cancellation_revenue;
END;
