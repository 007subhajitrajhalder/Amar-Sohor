-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Sep 25, 2026 at 05:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amar_sohor`
--

-- --------------------------------------------------------

--
-- Table structure for table `agencies`
--

CREATE TABLE `agencies` (
  `agency_id` int(10) UNSIGNED NOT NULL,
  `agency_name` varchar(150) NOT NULL,
  `department_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agencies`
--

INSERT INTO `agencies` (`agency_id`, `agency_name`, `department_type`) VALUES
(1, 'KMC SWM Department', 'Solid Waste Management'),
(2, 'KMC Sanitation Department', 'Public Sanitation'),
(3, 'KMC Water Department', 'Water Services'),
(4, 'Kolkata Police', 'Parking Management');

-- --------------------------------------------------------

--
-- Table structure for table `agency_members`
--

CREATE TABLE `agency_members` (
  `agent_id` int(10) UNSIGNED NOT NULL,
  `agency_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `facility_id` int(10) UNSIGNED NOT NULL,
  `facility_name` varchar(150) NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `address` text NOT NULL,
  `added_by` int(10) UNSIGNED NOT NULL,
  `status` enum('SUSPENDED','OPEN','UNDER_REPAIR') NOT NULL DEFAULT 'OPEN',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `photo_url` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facility_categories`
--

CREATE TABLE `facility_categories` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `handling_agency` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facility_categories`
--

INSERT INTO `facility_categories` (`category_id`, `category_name`, `handling_agency`) VALUES
(1, 'DUSTBIN', 1),
(2, 'TOILET', 2),
(3, 'WATER_POINT', 3),
(4, 'PARKING', 4);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(10) UNSIGNED NOT NULL,
  `facility_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `recommendation_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `address` text NOT NULL,
  `photo_url` varchar(1000) NOT NULL,
  `status` enum('PENDING','ALLOCATED','UNDER_INVESTIGATION','APPROVED','REJECTED','INSTALLED') NOT NULL DEFAULT 'PENDING',
  `assigned_agency` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recommendation_investigations`
--

CREATE TABLE `recommendation_investigations` (
  `investigation_id` int(10) UNSIGNED NOT NULL,
  `recommendation_id` int(10) UNSIGNED NOT NULL,
  `description` varchar(1000) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verification_status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(10) UNSIGNED NOT NULL,
  `facility_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `photo_url` varchar(1000) NOT NULL,
  `status` enum('PENDING','UNDER_INVESTIGATION','RESOLVED') NOT NULL DEFAULT 'PENDING',
  `assigned_agency` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_resolution_submissions`
--

CREATE TABLE `report_resolution_submissions` (
  `resolution_id` int(10) UNSIGNED NOT NULL,
  `report_id` int(10) UNSIGNED NOT NULL,
  `agent_id` int(10) UNSIGNED NOT NULL,
  `resolution_photo` varchar(1000) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verification_status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('ADMIN','USER','AGENT') NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `created_at`, `role`) VALUES
(7, 'raj', '007rajhalder@gmail.com', '8100313754', 'dfsfsdfsdfsadfs', '2026-09-25 12:53:15', 'ADMIN'),
(9, 'Amar Sohor Test User', 'testuser@example.com', '9000000001', 'test123', '2026-09-25 13:38:56', 'USER'),
(10, 'subhajit halder', '007subhajitrajhalder@gmail.com', '9875381849', '18092003', '2026-09-25 15:10:31', 'USER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agencies`
--
ALTER TABLE `agencies`
  ADD PRIMARY KEY (`agency_id`),
  ADD UNIQUE KEY `agency_name` (`agency_name`);

--
-- Indexes for table `agency_members`
--
ALTER TABLE `agency_members`
  ADD PRIMARY KEY (`agent_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_agency_members_agency` (`agency_id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`facility_id`),
  ADD KEY `fk_facilities_agent` (`added_by`),
  ADD KEY `idx_facilities_category` (`category_id`),
  ADD KEY `idx_facilities_status` (`status`),
  ADD KEY `idx_facilities_coordinates` (`latitude`,`longitude`);

--
-- Indexes for table `facility_categories`
--
ALTER TABLE `facility_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`),
  ADD KEY `fk_categories_agency` (`handling_agency`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `fk_ratings_user` (`user_id`),
  ADD KEY `idx_ratings_facility` (`facility_id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`recommendation_id`),
  ADD KEY `idx_recommendations_user` (`user_id`),
  ADD KEY `idx_recommendations_category` (`category_id`),
  ADD KEY `idx_recommendations_agency` (`assigned_agency`),
  ADD KEY `idx_recommendations_status` (`status`);

--
-- Indexes for table `recommendation_investigations`
--
ALTER TABLE `recommendation_investigations`
  ADD PRIMARY KEY (`investigation_id`),
  ADD KEY `fk_investigation_recommendation` (`recommendation_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `fk_reports_facility` (`facility_id`),
  ADD KEY `idx_reports_user` (`user_id`),
  ADD KEY `idx_reports_agency` (`assigned_agency`),
  ADD KEY `idx_reports_status` (`status`);

--
-- Indexes for table `report_resolution_submissions`
--
ALTER TABLE `report_resolution_submissions`
  ADD PRIMARY KEY (`resolution_id`),
  ADD KEY `fk_report_resolution_report` (`report_id`),
  ADD KEY `fk_report_resolution_agent` (`agent_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agencies`
--
ALTER TABLE `agencies`
  MODIFY `agency_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `agency_members`
--
ALTER TABLE `agency_members`
  MODIFY `agent_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `facility_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facility_categories`
--
ALTER TABLE `facility_categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `recommendation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recommendation_investigations`
--
ALTER TABLE `recommendation_investigations`
  MODIFY `investigation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report_resolution_submissions`
--
ALTER TABLE `report_resolution_submissions`
  MODIFY `resolution_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agency_members`
--
ALTER TABLE `agency_members`
  ADD CONSTRAINT `fk_agency_members_agency` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`agency_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_agency_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `facilities`
--
ALTER TABLE `facilities`
  ADD CONSTRAINT `fk_facilities_agent` FOREIGN KEY (`added_by`) REFERENCES `agency_members` (`agent_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_facilities_category` FOREIGN KEY (`category_id`) REFERENCES `facility_categories` (`category_id`) ON UPDATE CASCADE;

--
-- Constraints for table `facility_categories`
--
ALTER TABLE `facility_categories`
  ADD CONSTRAINT `fk_categories_agency` FOREIGN KEY (`handling_agency`) REFERENCES `agencies` (`agency_id`) ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `fk_ratings_facility` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`facility_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ratings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `fk_recommendations_agency` FOREIGN KEY (`assigned_agency`) REFERENCES `agencies` (`agency_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_recommendations_category` FOREIGN KEY (`category_id`) REFERENCES `facility_categories` (`category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_recommendations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `recommendation_investigations`
--
ALTER TABLE `recommendation_investigations`
  ADD CONSTRAINT `fk_investigation_recommendation` FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations` (`recommendation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `fk_reports_agency` FOREIGN KEY (`assigned_agency`) REFERENCES `agencies` (`agency_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reports_facility` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`facility_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `report_resolution_submissions`
--
ALTER TABLE `report_resolution_submissions`
  ADD CONSTRAINT `fk_report_resolution_agent` FOREIGN KEY (`agent_id`) REFERENCES `agency_members` (`agent_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_resolution_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
