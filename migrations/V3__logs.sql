CREATE TABLE logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  log_type VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  parent_id BIGINT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents (id)
);