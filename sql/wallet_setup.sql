IF OBJECT_ID('dbo.Wallet', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Wallet (
        wallet_id INT IDENTITY(1,1) PRIMARY KEY,
        vnpay_code VARCHAR(50) NOT NULL UNIQUE,
        momo_code VARCHAR(50) NOT NULL UNIQUE,
        balance DECIMAL(14,2) NOT NULL CONSTRAINT DF_Wallet_Balance DEFAULT (500000000),
        user_id INT NOT NULL UNIQUE,
        CONSTRAINT FK_Wallet_User FOREIGN KEY (user_id) REFERENCES dbo.[User](user_id)
    );
END;
GO

INSERT INTO dbo.Wallet (vnpay_code, momo_code, balance, user_id)
SELECT
    CONCAT('VNPAY-', RIGHT(CONCAT('000000', CAST(u.user_id AS VARCHAR(10))), 6)),
    CONCAT('MOMO-', RIGHT(CONCAT('000000', CAST(u.user_id AS VARCHAR(10))), 6)),
    CAST(500000000 AS DECIMAL(14,2)),
    u.user_id
FROM dbo.[User] u
WHERE u.role = 'CUSTOMER'
  AND NOT EXISTS (
      SELECT 1
      FROM dbo.Wallet w
      WHERE w.user_id = u.user_id
  );
GO

SELECT wallet_id, user_id, vnpay_code, momo_code, balance
FROM dbo.Wallet
ORDER BY user_id;
