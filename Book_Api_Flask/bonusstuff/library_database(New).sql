-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 09, 2025 at 03:14 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int NOT NULL COMMENT 'Incremental ID for table Books',
  `book_title` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Book title',
  `book_author` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Author',
  `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `genre` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Book created at',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `book_title`, `book_author`, `description`, `genre`, `created_at`, `updated_at`, `file_path`) VALUES
(34, 'Testificate', 'Testificate', 'Testificate', 'Testificate', '2025-07-08 13:45:05', '2025-07-08 15:09:35', 'uploads\\Learning_Computer_Architecture_with_Raspberry_Pi.pdf'),
(35, 'Python for Penetration Testing', 'Packt>', 'A Penetration testing guide using Python programming language', 'Education', '2025-07-08 13:49:08', '2025-07-08 14:16:43', 'uploads\\Python___penetration_testing_for_developers.pdf'),
(38, 'ttest', 'test', 'etstse', 'estes', '2025-07-08 15:39:23', '2025-07-08 15:39:23', 'uploads\\nmap_network_scanning.pdf'),
(39, 'Offensive Security Penetration Testing with BackTrack', 'Mati Aharoni', 'Penetration Testing guide book (2011 Edition)', 'Education', '2025-07-08 17:05:32', '2025-07-08 17:05:32', 'uploads\\Offensive_Security_-_Pentesting_with_Backtrack_PWB.pdf'),
(40, 'Testificate', 'Testificate', 'Testificate', 'Testificate', '2025-07-08 17:14:16', '2025-07-09 02:53:18', 'uploads\\Learning_Computer_Architecture_with_Raspberry_Pi.pdf'),
(41, 'test', 'tse', 'tset', 'test', '2025-07-08 17:16:24', '2025-07-08 17:16:24', 'uploads\\Comptia_A_Complete_Study_Guide_Exams_Exams_220-901_and_220-902.pdf'),
(42, 'test', 'tse', 'tset', 'test', '2025-07-08 17:16:44', '2025-07-08 17:16:44', 'uploads\\1057_1084_4iKI_Penetration_Testing_Report_Final_Exam.pdf'),
(43, 'abcdefg', 'abcdefg', 'abcdefg', 'abcdefg', '2025-07-08 18:36:35', '2025-07-08 18:36:35', 'uploads\\Practical_Internet_of_Things_Security.pdf'),
(44, 'The Manga Cryptography', 'Test', 'test', 'Education', '2025-07-08 18:49:18', '2025-07-08 18:49:18', 'uploads\\The_Manga_Guide_to_Cryptography.pdf'),
(45, 'test', 'test', 'test', 'test', '2025-07-09 02:30:55', '2025-07-09 02:30:55', 'uploads\\MCSA_Windows_Server_2016_Complete_Study_Guide_2nd_Edition.pdf'),
(46, 'Abcdefgh', 'ad', 'dada', 'abba', '2025-07-09 02:45:20', '2025-07-09 02:45:20', 'uploads\\The_NICE_Cyber_Security_Framework_.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `testificate`
--

CREATE TABLE `testificate` (
  `id` int NOT NULL,
  `tester` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(8, 'AV8R@gmail.com', 'pbkdf2:sha256:1000000$Sf6eSzZeIociU6El$fe22e9b47840a9fa3df851af0c9fcc0daf20d013abd6283bd000cef2be3b2f9e', 'admin', '2025-07-08 18:25:27', '2025-07-08 18:25:27'),
(9, 'ZFert@gmail.com', 'pbkdf2:sha256:1000000$Ap5lHWf5i3nUouKu$8d13b5b1f6f016695c6aaa20d62b273aed68364e6f3773a39089df26408f05ef', 'admin', '2025-07-08 18:30:45', '2025-07-08 18:30:45'),
(10, 'Elbin@gmail.com', 'pbkdf2:sha256:1000000$D9mq5mEOVSSgegW7$0f723d47a98f90f5643273766b09a5332378f59aefe0cc038e15402d5f62a01b', 'admin', '2025-07-08 18:32:27', '2025-07-08 18:32:27'),
(11, 'Viktor@gmail.com', 'pbkdf2:sha256:1000000$tIfsAVn9RPuTBbwW$b2540d1d1ea672488b45d3e98ca1acc129614f3075ac4094722050be24c06ecf', 'admin', '2025-07-08 18:35:06', '2025-07-08 18:35:06'),
(12, 'abcdefghijk@gmail.com', 'pbkdf2:sha256:1000000$cT8UswxcavECIf9B$869376fd586eaf761234c10dc946924f4ee6a41641275fd68749f5b606158e06', 'user', '2025-07-09 02:23:51', '2025-07-09 02:23:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int NOT NULL AUTO_INCREMENT COMMENT 'Incremental ID for table Books', AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
