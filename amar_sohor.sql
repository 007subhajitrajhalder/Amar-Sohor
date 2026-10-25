-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 25, 2026 at 05:00 PM
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

--
-- Dumping data for table `agency_members`
--

INSERT INTO `agency_members` (`agent_id`, `agency_id`, `user_id`, `latitude`, `longitude`) VALUES
(9, 1, 11, NULL, NULL),
(10, 2, 12, NULL, NULL),
(11, 3, 13, NULL, NULL),
(12, 1, 14, NULL, NULL),
(13, 2, 15, NULL, NULL),
(14, 3, 16, NULL, NULL),
(15, 1, 17, NULL, NULL),
(16, 2, 18, NULL, NULL),
(17, 3, 19, NULL, NULL),
(18, 1, 20, NULL, NULL),
(19, 2, 21, NULL, NULL),
(20, 3, 22, NULL, NULL),
(21, 1, 23, NULL, NULL),
(22, 2, 24, NULL, NULL),
(23, 3, 25, NULL, NULL),
(24, 1, 26, NULL, NULL),
(25, 2, 27, NULL, NULL),
(26, 3, 28, NULL, NULL),
(27, 1, 29, NULL, NULL),
(28, 2, 30, NULL, NULL),
(29, 3, 31, NULL, NULL),
(30, 1, 32, NULL, NULL),
(31, 2, 33, NULL, NULL),
(32, 3, 34, NULL, NULL),
(33, 1, 35, NULL, NULL),
(34, 2, 36, NULL, NULL),
(35, 3, 37, NULL, NULL),
(36, 1, 38, NULL, NULL),
(37, 2, 39, NULL, NULL),
(38, 3, 40, NULL, NULL),
(39, 1, 41, NULL, NULL),
(40, 2, 42, NULL, NULL),
(41, 3, 43, NULL, NULL),
(42, 1, 44, NULL, NULL),
(43, 2, 45, NULL, NULL),
(44, 3, 46, NULL, NULL),
(45, 1, 47, NULL, NULL),
(46, 2, 48, NULL, NULL),
(47, 3, 49, NULL, NULL),
(48, 1, 50, NULL, NULL),
(49, 2, 51, NULL, NULL),
(50, 3, 52, NULL, NULL),
(51, 1, 53, NULL, NULL),
(52, 2, 54, NULL, NULL),
(53, 3, 55, NULL, NULL),
(54, 1, 56, NULL, NULL),
(55, 2, 57, NULL, NULL),
(56, 3, 58, NULL, NULL),
(57, 1, 59, NULL, NULL),
(58, 2, 60, NULL, NULL),
(59, 3, 61, NULL, NULL),
(60, 1, 62, NULL, NULL),
(61, 2, 63, NULL, NULL),
(62, 3, 64, NULL, NULL),
(63, 1, 65, NULL, NULL),
(64, 2, 66, NULL, NULL),
(65, 3, 67, NULL, NULL),
(66, 1, 68, NULL, NULL),
(67, 2, 69, NULL, NULL),
(68, 3, 70, NULL, NULL),
(69, 1, 71, NULL, NULL),
(70, 2, 72, NULL, NULL),
(71, 3, 73, NULL, NULL),
(72, 1, 74, NULL, NULL),
(73, 2, 75, NULL, NULL),
(74, 3, 76, NULL, NULL),
(75, 1, 77, NULL, NULL),
(76, 2, 78, NULL, NULL),
(77, 3, 79, NULL, NULL),
(78, 1, 80, NULL, NULL),
(79, 2, 81, NULL, NULL),
(80, 3, 82, NULL, NULL),
(81, 1, 83, NULL, NULL),
(82, 2, 84, NULL, NULL),
(83, 3, 85, NULL, NULL),
(84, 1, 86, NULL, NULL),
(85, 2, 87, NULL, NULL),
(86, 3, 88, NULL, NULL),
(87, 1, 89, NULL, NULL),
(88, 2, 90, NULL, NULL),
(89, 3, 91, NULL, NULL),
(90, 1, 92, NULL, NULL),
(91, 2, 93, NULL, NULL),
(92, 3, 94, NULL, NULL),
(93, 1, 95, NULL, NULL),
(94, 2, 96, NULL, NULL),
(95, 3, 97, NULL, NULL),
(96, 1, 98, NULL, NULL),
(97, 2, 99, NULL, NULL),
(98, 3, 100, NULL, NULL),
(99, 1, 101, NULL, NULL),
(100, 2, 102, NULL, NULL),
(101, 3, 103, NULL, NULL),
(102, 1, 104, NULL, NULL),
(103, 2, 105, NULL, NULL),
(104, 3, 106, NULL, NULL),
(105, 1, 107, NULL, NULL),
(106, 2, 108, NULL, NULL),
(107, 3, 109, NULL, NULL),
(108, 1, 110, NULL, NULL),
(109, 2, 111, NULL, NULL),
(110, 3, 112, NULL, NULL),
(111, 1, 113, NULL, NULL),
(112, 2, 114, NULL, NULL),
(113, 3, 115, NULL, NULL),
(114, 1, 116, NULL, NULL),
(115, 2, 117, NULL, NULL),
(116, 3, 118, NULL, NULL),
(117, 1, 119, NULL, NULL),
(118, 2, 120, NULL, NULL),
(119, 3, 121, NULL, NULL),
(120, 1, 122, NULL, NULL),
(121, 2, 123, NULL, NULL),
(122, 3, 124, NULL, NULL),
(123, 1, 125, NULL, NULL),
(124, 2, 126, NULL, NULL),
(125, 3, 127, NULL, NULL),
(126, 1, 128, NULL, NULL),
(127, 2, 129, NULL, NULL),
(128, 3, 130, NULL, NULL),
(129, 1, 131, NULL, NULL),
(130, 2, 132, NULL, NULL),
(131, 3, 133, NULL, NULL),
(132, 1, 134, NULL, NULL),
(133, 2, 135, NULL, NULL),
(134, 3, 136, NULL, NULL),
(135, 1, 137, NULL, NULL),
(136, 2, 138, NULL, NULL),
(137, 3, 139, NULL, NULL),
(138, 1, 140, NULL, NULL),
(139, 2, 141, NULL, NULL),
(140, 3, 142, NULL, NULL),
(141, 1, 143, NULL, NULL),
(142, 2, 144, NULL, NULL),
(143, 3, 145, NULL, NULL),
(144, 1, 146, NULL, NULL),
(145, 2, 147, NULL, NULL),
(146, 3, 148, NULL, NULL),
(147, 1, 149, NULL, NULL),
(148, 2, 150, NULL, NULL),
(149, 3, 151, NULL, NULL),
(150, 1, 152, NULL, NULL),
(151, 2, 153, NULL, NULL),
(152, 3, 154, NULL, NULL),
(153, 1, 155, NULL, NULL),
(154, 2, 156, NULL, NULL),
(155, 3, 157, NULL, NULL),
(156, 1, 158, NULL, NULL),
(157, 2, 159, NULL, NULL),
(158, 3, 160, NULL, NULL),
(159, 1, 161, NULL, NULL),
(160, 2, 162, NULL, NULL),
(161, 3, 163, NULL, NULL),
(162, 1, 164, NULL, NULL),
(163, 2, 165, NULL, NULL),
(164, 3, 166, NULL, NULL),
(165, 1, 167, NULL, NULL),
(166, 2, 168, NULL, NULL),
(167, 3, 169, NULL, NULL),
(168, 1, 170, NULL, NULL),
(169, 2, 171, NULL, NULL),
(170, 3, 172, NULL, NULL),
(171, 1, 173, NULL, NULL),
(172, 2, 174, NULL, NULL),
(173, 3, 175, NULL, NULL),
(174, 1, 176, NULL, NULL),
(175, 2, 177, NULL, NULL),
(176, 3, 178, NULL, NULL),
(177, 1, 179, NULL, NULL),
(178, 2, 180, NULL, NULL),
(179, 3, 181, NULL, NULL),
(180, 1, 182, NULL, NULL),
(181, 2, 183, NULL, NULL),
(182, 3, 184, NULL, NULL),
(183, 1, 185, NULL, NULL),
(184, 2, 186, NULL, NULL),
(185, 3, 187, NULL, NULL),
(186, 1, 188, NULL, NULL),
(187, 2, 189, NULL, NULL),
(188, 3, 190, NULL, NULL),
(189, 1, 191, NULL, NULL),
(190, 2, 192, NULL, NULL),
(191, 3, 193, NULL, NULL),
(192, 1, 194, NULL, NULL),
(193, 2, 195, NULL, NULL),
(194, 3, 196, NULL, NULL),
(195, 1, 197, NULL, NULL),
(196, 2, 198, NULL, NULL),
(197, 3, 199, NULL, NULL),
(198, 1, 200, NULL, NULL),
(199, 2, 201, NULL, NULL),
(200, 3, 202, NULL, NULL),
(201, 1, 203, NULL, NULL),
(202, 2, 204, NULL, NULL),
(203, 3, 205, NULL, NULL),
(204, 1, 206, NULL, NULL),
(205, 2, 207, NULL, NULL),
(206, 3, 208, NULL, NULL),
(207, 1, 209, NULL, NULL),
(208, 2, 210, NULL, NULL),
(209, 3, 211, NULL, NULL),
(210, 1, 212, NULL, NULL),
(211, 2, 213, NULL, NULL),
(212, 3, 214, NULL, NULL),
(213, 1, 215, NULL, NULL),
(214, 2, 216, NULL, NULL),
(215, 3, 217, NULL, NULL),
(216, 1, 218, NULL, NULL),
(217, 2, 219, NULL, NULL),
(218, 3, 220, NULL, NULL),
(219, 1, 221, NULL, NULL),
(220, 2, 222, NULL, NULL),
(221, 3, 223, NULL, NULL),
(222, 1, 224, NULL, NULL),
(223, 2, 225, NULL, NULL),
(224, 3, 226, NULL, NULL),
(225, 1, 227, NULL, NULL),
(226, 2, 228, NULL, NULL),
(227, 3, 229, NULL, NULL),
(228, 1, 230, NULL, NULL),
(229, 2, 231, NULL, NULL),
(230, 3, 232, NULL, NULL),
(231, 1, 233, NULL, NULL),
(232, 2, 234, NULL, NULL),
(233, 3, 235, NULL, NULL),
(234, 1, 236, NULL, NULL),
(235, 2, 237, NULL, NULL),
(236, 3, 238, NULL, NULL),
(237, 1, 239, NULL, NULL),
(238, 2, 240, NULL, NULL),
(239, 3, 241, NULL, NULL),
(240, 1, 242, NULL, NULL),
(241, 2, 243, NULL, NULL),
(242, 3, 244, NULL, NULL),
(243, 1, 245, NULL, NULL),
(244, 2, 246, NULL, NULL),
(245, 3, 247, NULL, NULL),
(246, 1, 248, NULL, NULL),
(247, 2, 249, NULL, NULL),
(248, 3, 250, NULL, NULL),
(249, 1, 251, NULL, NULL),
(250, 2, 252, NULL, NULL),
(251, 3, 253, NULL, NULL),
(252, 1, 254, NULL, NULL),
(253, 2, 255, NULL, NULL),
(254, 3, 256, NULL, NULL),
(255, 1, 257, NULL, NULL),
(256, 2, 258, NULL, NULL),
(257, 3, 259, NULL, NULL),
(258, 1, 260, NULL, NULL),
(259, 2, 261, NULL, NULL),
(260, 3, 262, NULL, NULL),
(261, 1, 263, NULL, NULL),
(262, 2, 264, NULL, NULL),
(263, 3, 265, NULL, NULL),
(264, 1, 266, NULL, NULL),
(265, 2, 267, NULL, NULL),
(266, 3, 268, NULL, NULL),
(267, 1, 269, NULL, NULL),
(268, 2, 270, NULL, NULL),
(269, 3, 271, NULL, NULL),
(270, 1, 272, NULL, NULL),
(271, 2, 273, NULL, NULL),
(272, 3, 274, NULL, NULL),
(273, 1, 275, NULL, NULL),
(274, 2, 276, NULL, NULL),
(275, 3, 277, NULL, NULL),
(276, 1, 278, NULL, NULL),
(277, 2, 279, NULL, NULL),
(278, 3, 280, NULL, NULL),
(279, 1, 281, NULL, NULL),
(280, 2, 282, NULL, NULL),
(281, 3, 283, NULL, NULL),
(282, 1, 284, NULL, NULL),
(283, 2, 285, NULL, NULL),
(284, 3, 286, NULL, NULL),
(285, 1, 287, NULL, NULL),
(286, 2, 288, NULL, NULL),
(287, 3, 289, NULL, NULL),
(288, 1, 290, NULL, NULL),
(289, 2, 291, NULL, NULL),
(290, 3, 292, NULL, NULL),
(291, 1, 293, NULL, NULL),
(292, 2, 294, NULL, NULL),
(293, 3, 295, NULL, NULL),
(294, 1, 296, NULL, NULL),
(295, 2, 297, NULL, NULL),
(296, 3, 298, NULL, NULL),
(297, 1, 299, NULL, NULL),
(298, 2, 300, NULL, NULL),
(299, 3, 301, NULL, NULL),
(300, 1, 302, NULL, NULL),
(301, 2, 303, NULL, NULL),
(302, 3, 304, NULL, NULL),
(303, 1, 305, NULL, NULL),
(304, 2, 306, NULL, NULL),
(305, 3, 307, NULL, NULL),
(306, 1, 308, NULL, NULL),
(307, 2, 309, NULL, NULL),
(308, 3, 310, NULL, NULL),
(309, 1, 311, NULL, NULL),
(310, 2, 312, NULL, NULL),
(311, 3, 313, NULL, NULL),
(312, 1, 314, NULL, NULL),
(313, 2, 315, NULL, NULL),
(314, 3, 316, NULL, NULL),
(315, 1, 317, NULL, NULL),
(316, 2, 318, NULL, NULL),
(317, 3, 319, NULL, NULL),
(318, 1, 320, NULL, NULL),
(319, 2, 321, NULL, NULL),
(320, 3, 322, NULL, NULL),
(321, 1, 323, NULL, NULL),
(322, 2, 324, NULL, NULL),
(323, 3, 325, NULL, NULL),
(324, 1, 326, NULL, NULL),
(325, 2, 327, NULL, NULL),
(326, 3, 328, NULL, NULL),
(327, 1, 329, NULL, NULL),
(328, 2, 330, NULL, NULL),
(329, 3, 331, NULL, NULL),
(330, 1, 332, NULL, NULL),
(331, 2, 333, NULL, NULL),
(332, 3, 334, NULL, NULL),
(333, 1, 335, NULL, NULL),
(334, 2, 336, NULL, NULL),
(335, 3, 337, NULL, NULL),
(336, 1, 338, NULL, NULL),
(337, 2, 339, NULL, NULL),
(338, 3, 340, NULL, NULL),
(339, 1, 341, NULL, NULL),
(340, 2, 342, NULL, NULL),
(341, 3, 343, NULL, NULL),
(342, 1, 344, NULL, NULL),
(343, 2, 345, NULL, NULL),
(344, 3, 346, NULL, NULL),
(345, 1, 347, NULL, NULL),
(346, 2, 348, NULL, NULL),
(347, 3, 349, NULL, NULL),
(348, 1, 350, NULL, NULL),
(349, 2, 351, NULL, NULL),
(350, 3, 352, NULL, NULL),
(351, 1, 353, NULL, NULL),
(352, 2, 354, NULL, NULL),
(353, 3, 355, NULL, NULL),
(354, 1, 356, NULL, NULL),
(355, 2, 357, NULL, NULL),
(356, 3, 358, NULL, NULL),
(357, 1, 359, NULL, NULL),
(358, 2, 360, NULL, NULL),
(359, 3, 361, NULL, NULL),
(360, 1, 362, NULL, NULL),
(361, 2, 363, NULL, NULL),
(362, 3, 364, NULL, NULL),
(363, 1, 365, NULL, NULL),
(364, 2, 366, NULL, NULL),
(365, 3, 367, NULL, NULL),
(366, 1, 368, NULL, NULL),
(367, 2, 369, NULL, NULL),
(368, 3, 370, NULL, NULL),
(369, 1, 371, NULL, NULL),
(370, 2, 372, NULL, NULL),
(371, 3, 373, NULL, NULL),
(372, 1, 374, NULL, NULL),
(373, 2, 375, NULL, NULL),
(374, 3, 376, NULL, NULL),
(375, 1, 377, NULL, NULL),
(376, 2, 378, NULL, NULL),
(377, 3, 379, NULL, NULL),
(378, 1, 380, NULL, NULL),
(379, 2, 381, NULL, NULL),
(380, 3, 382, NULL, NULL),
(381, 1, 383, NULL, NULL),
(382, 2, 384, NULL, NULL),
(383, 3, 385, NULL, NULL),
(384, 1, 386, NULL, NULL),
(385, 2, 387, NULL, NULL),
(386, 3, 388, NULL, NULL),
(387, 1, 389, NULL, NULL),
(388, 2, 390, NULL, NULL),
(389, 3, 391, NULL, NULL),
(390, 1, 392, NULL, NULL),
(391, 2, 393, NULL, NULL),
(392, 3, 394, NULL, NULL),
(393, 1, 395, NULL, NULL),
(394, 2, 396, NULL, NULL),
(395, 3, 397, NULL, NULL),
(396, 1, 398, NULL, NULL),
(397, 2, 399, NULL, NULL),
(398, 3, 400, NULL, NULL),
(399, 1, 401, NULL, NULL),
(400, 2, 402, NULL, NULL),
(401, 3, 403, NULL, NULL),
(402, 1, 404, NULL, NULL),
(403, 2, 405, NULL, NULL),
(404, 3, 406, NULL, NULL),
(405, 1, 407, NULL, NULL),
(406, 2, 408, NULL, NULL),
(407, 3, 409, NULL, NULL),
(408, 1, 410, NULL, NULL),
(409, 2, 411, NULL, NULL),
(410, 3, 412, NULL, NULL),
(411, 1, 413, NULL, NULL),
(412, 2, 414, NULL, NULL),
(413, 3, 415, NULL, NULL),
(414, 1, 416, NULL, NULL),
(415, 2, 417, NULL, NULL),
(416, 3, 418, NULL, NULL),
(417, 1, 419, NULL, NULL),
(418, 2, 420, NULL, NULL),
(419, 3, 421, NULL, NULL),
(420, 1, 422, NULL, NULL),
(421, 2, 423, NULL, NULL),
(422, 3, 424, NULL, NULL),
(423, 1, 425, NULL, NULL),
(424, 2, 426, NULL, NULL),
(425, 3, 427, NULL, NULL),
(426, 1, 428, NULL, NULL),
(427, 2, 429, NULL, NULL),
(428, 3, 430, NULL, NULL),
(429, 1, 431, NULL, NULL),
(430, 2, 432, NULL, NULL),
(431, 3, 433, NULL, NULL),
(432, 1, 434, NULL, NULL),
(433, 2, 435, NULL, NULL),
(434, 3, 436, NULL, NULL),
(435, 1, 437, NULL, NULL),
(436, 2, 438, NULL, NULL),
(437, 3, 439, NULL, NULL),
(438, 1, 440, NULL, NULL),
(439, 2, 441, NULL, NULL),
(440, 3, 442, NULL, NULL),
(441, 4, 443, NULL, NULL),
(442, 4, 444, NULL, NULL),
(443, 4, 445, NULL, NULL),
(444, 4, 446, NULL, NULL),
(445, 4, 447, NULL, NULL),
(446, 4, 448, NULL, NULL),
(447, 4, 449, NULL, NULL),
(448, 4, 450, NULL, NULL),
(449, 4, 451, NULL, NULL),
(450, 4, 452, NULL, NULL),
(451, 4, 453, NULL, NULL),
(452, 4, 454, NULL, NULL),
(453, 4, 455, NULL, NULL),
(454, 4, 456, NULL, NULL),
(455, 4, 457, NULL, NULL),
(456, 4, 458, NULL, NULL),
(457, 4, 459, NULL, NULL),
(458, 4, 460, NULL, NULL),
(459, 4, 461, NULL, NULL),
(460, 4, 462, NULL, NULL),
(461, 4, 463, NULL, NULL),
(462, 4, 464, NULL, NULL),
(463, 4, 465, NULL, NULL),
(464, 4, 466, NULL, NULL),
(465, 4, 467, NULL, NULL),
(466, 4, 468, NULL, NULL),
(467, 4, 469, NULL, NULL),
(468, 4, 470, NULL, NULL),
(469, 4, 471, NULL, NULL),
(470, 4, 472, NULL, NULL),
(471, 4, 473, NULL, NULL),
(472, 4, 474, NULL, NULL),
(473, 4, 475, NULL, NULL),
(474, 4, 476, NULL, NULL),
(475, 4, 477, NULL, NULL),
(476, 4, 478, NULL, NULL),
(477, 4, 479, NULL, NULL),
(478, 4, 480, NULL, NULL),
(479, 4, 481, NULL, NULL),
(480, 4, 482, NULL, NULL),
(481, 4, 483, 22.5800200, 88.3935600),
(482, 4, 484, 22.6233400, 88.4475600),
(483, 4, 485, 22.5436600, 88.3525600),
(484, 4, 486, 22.6129800, 88.3745600),
(485, 4, 487, 22.4541900, 88.3035600),
(486, 4, 488, 22.5679100, 88.3697600),
(487, 4, 489, 22.4983300, 88.3435600),
(488, 4, 490, 22.5676500, 88.3455600),
(489, 4, 491, 22.5163600, 88.3865600),
(490, 4, 492, 22.6176800, 88.4305600),
(491, 4, 493, 22.5440000, 88.2815600),
(492, 4, 494, 22.5453200, 88.3495600),
(493, 4, 495, 22.6396400, 88.3635600),
(494, 4, 496, 22.4638500, 88.3895600),
(495, 4, 497, 22.5602700, 88.3512600),
(496, 4, 498, 22.4909900, 88.3155600),
(497, 4, 499, 22.5508100, 88.3405600),
(498, 4, 500, 22.5130200, 88.3985600),
(499, 4, 501, 22.6063400, 88.4005600),
(500, 4, 502, 22.5536600, 88.2655600),
(501, 4, 503, 22.5649800, 88.3485600),
(502, 4, 504, 22.6111900, 88.3875600),
(503, 4, 505, 22.4725100, 88.3655600),
(504, 4, 506, 22.5853300, 88.3411600),
(505, 4, 507, 22.6324500, 88.4205600),
(506, 4, 508, 22.5363600, 88.3295600),
(507, 4, 509, 22.5546800, 88.3885600),
(508, 4, 510, 22.6050000, 88.4235600),
(509, 4, 511, 22.5093200, 88.3135600),
(510, 4, 512, 22.5706400, 88.3395600),
(511, 4, 513, 22.5798500, 88.3775600),
(512, 4, 514, 22.4421700, 88.3915600),
(513, 4, 515, 22.5505900, 88.3509600),
(514, 4, 516, 22.6028100, 88.3835600),
(515, 4, 517, 22.5210200, 88.3415600),
(516, 4, 518, 22.5393400, 88.3635600),
(517, 4, 519, 22.5796600, 88.4685600),
(518, 1, 520, 22.6049800, 88.4005600),
(519, 1, 521, 22.5551900, 88.2655600),
(520, 2, 522, 22.5925100, 88.3545600),
(521, 2, 523, 22.5268300, 88.3135600),
(522, 3, 524, 22.5592500, 88.3512600),
(523, 3, 525, 22.4928600, 88.3155600),
(524, 4, 526, 22.5356800, 88.3405600),
(525, 4, 527, 22.5930000, 88.3895600),
(999, 1, 530, NULL, NULL);

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
  `photo_url` varchar(1000) DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `source_recommendation_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`facility_id`, `facility_name`, `category_id`, `latitude`, `longitude`, `address`, `added_by`, `status`, `created_at`, `photo_url`, `additional_notes`, `source_recommendation_id`) VALUES
(1, 'College Street Public Toilet', 2, 22.5744000, 88.3629000, 'College Street, Kolkata', 520, 'OPEN', '2026-10-14 07:44:07', NULL, NULL, NULL),
(2, 'Gariahat Community Dustbin', 1, 22.5186000, 88.3653000, 'Gariahat, Kolkata', 518, 'OPEN', '2026-10-14 07:44:07', NULL, NULL, NULL),
(3, 'Sealdah Drinking Water Point', 3, 22.5674000, 88.3712000, 'Sealdah, Kolkata', 522, 'OPEN', '2026-10-14 07:44:07', NULL, NULL, NULL),
(4, 'New Market Parking Area', 4, 22.5601000, 88.3527000, 'New Market, Kolkata', 524, 'OPEN', '2026-10-14 07:44:07', NULL, NULL, NULL),
(5, 'Park Street Dustbin', 1, 22.5511000, 88.3524000, 'Park Street, Kolkata', 519, 'OPEN', '2026-10-14 07:44:07', NULL, NULL, NULL),
(6, 'Howrah Parking Zone', 4, 22.5855000, 88.3426000, 'Howrah Station Area, Howrah', 525, 'UNDER_REPAIR', '2026-10-14 07:44:07', NULL, NULL, NULL),
(7, 'Esplanade Community Dustbin', 1, 22.5641800, 88.3427300, 'Esplanade, Kolkata, West Bengal', 9, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-001.jpg', NULL, NULL),
(8, 'College Street Public Toilet', 2, 22.5741900, 88.3625200, 'College Street, Kolkata, West Bengal', 19, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-002.jpg', NULL, NULL),
(9, 'Gariahat Drinking Water Point', 3, 22.5186000, 88.3651100, 'Gariahat, Kolkata, West Bengal', 29, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-003.jpg', NULL, NULL),
(10, 'Sealdah Public Parking Area', 4, 22.5676100, 88.3712000, 'Sealdah, Kolkata, West Bengal', 450, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/4-004.jpg', NULL, NULL),
(11, 'New Market Community Dustbin', 1, 22.5605200, 88.3528900, 'New Market, Kolkata, West Bengal', 45, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/1-005.jpg', NULL, NULL),
(12, 'Howrah Station Public Toilet', 2, 22.5850800, 88.3429800, 'Howrah Station Area, Howrah, West Bengal', 55, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-006.jpg', NULL, NULL),
(13, 'Park Street Drinking Water Point', 3, 22.5508900, 88.3529700, 'Park Street, Kolkata, West Bengal', 65, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-007.jpg', NULL, NULL),
(14, 'Shyambazar Public Parking Area', 4, 22.6042000, 88.3728300, 'Shyambazar, Kolkata, West Bengal', 462, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-008.jpg', NULL, NULL),
(15, 'Ballygunge Community Dustbin', 1, 22.5287100, 88.3656200, 'Ballygunge, Kolkata, West Bengal', 81, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/1-009.jpg', NULL, NULL),
(16, 'Jadavpur Public Toilet', 2, 22.4984200, 88.3688100, 'Jadavpur, Kolkata, West Bengal', 91, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/2-010.jpg', NULL, NULL),
(17, 'Tollygunge Drinking Water Point', 3, 22.4980800, 88.3450000, 'Tollygunge, Kolkata, West Bengal', 101, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-011.jpg', NULL, NULL),
(18, 'Behala Public Parking Area', 4, 22.4912900, 88.3171900, 'Behala, Kolkata, West Bengal', 474, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-012.jpg', NULL, NULL),
(19, 'Dumdum Community Dustbin', 1, 22.6333000, 88.4223800, 'Dumdum, Kolkata, West Bengal', 117, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-013.jpg', NULL, NULL),
(20, 'Belgachia Public Toilet', 2, 22.6042100, 88.3855700, 'Belgachia, Kolkata, West Bengal', 127, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/2-014.jpg', NULL, NULL),
(21, 'Maniktala Drinking Water Point', 3, 22.5894200, 88.3734300, 'Maniktala, Kolkata, West Bengal', 137, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/3-015.jpg', NULL, NULL),
(22, 'Burrabazar Public Parking Area', 4, 22.5795800, 88.3536200, 'Burrabazar, Kolkata, West Bengal', 486, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-016.jpg', NULL, NULL),
(23, 'Bowbazar Community Dustbin', 1, 22.5647900, 88.3598100, 'Bowbazar, Kolkata, West Bengal', 153, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-017.jpg', NULL, NULL),
(24, 'Lalbazar Public Toilet', 2, 22.5685000, 88.3470000, 'Lalbazar, Kolkata, West Bengal', 163, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-018.jpg', NULL, NULL),
(25, 'Maidan Drinking Water Point', 3, 22.5522100, 88.3421900, 'Maidan, Kolkata, West Bengal', 173, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/3-019.jpg', NULL, NULL),
(26, 'Alipore Public Parking Area', 4, 22.5354200, 88.3313800, 'Alipore, Kolkata, West Bengal', 498, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/4-020.jpg', NULL, NULL),
(27, 'Kalighat Community Dustbin', 1, 22.5195800, 88.3435700, 'Kalighat, Kolkata, West Bengal', 189, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-021.jpg', NULL, NULL),
(28, 'Bhowanipore Public Toilet', 2, 22.5347900, 88.3414300, 'Bhowanipore, Kolkata, West Bengal', 199, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-022.jpg', NULL, NULL),
(29, 'Lake Gardens Drinking Water Point', 3, 22.5070000, 88.3526200, 'Lake Gardens, Kolkata, West Bengal', 209, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-023.jpg', NULL, NULL),
(30, 'Santoshpur Public Parking Area', 4, 22.4812100, 88.3838100, 'Santoshpur, Kolkata, West Bengal', 510, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/4-024.jpg', NULL, NULL),
(31, 'Kasba Community Dustbin', 1, 22.5154200, 88.3880000, 'Kasba, Kolkata, West Bengal', 225, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/1-025.jpg', NULL, NULL),
(32, 'Ruby Crossing Public Toilet', 2, 22.5115800, 88.4001900, 'Ruby Crossing, Kolkata, West Bengal', 235, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-026.jpg', NULL, NULL),
(33, 'Tangra Drinking Water Point', 3, 22.5537900, 88.3903800, 'Tangra, Kolkata, West Bengal', 245, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-027.jpg', NULL, NULL),
(34, 'Park Circus Public Parking Area', 4, 22.5390000, 88.3655700, 'Park Circus, Kolkata, West Bengal', 443, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-028.jpg', NULL, NULL),
(35, 'Ultadanga Community Dustbin', 1, 22.5932100, 88.3904300, 'Ultadanga, Kolkata, West Bengal', 261, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/1-029.jpg', NULL, NULL),
(36, 'Kankurgachi Public Toilet', 2, 22.5864200, 88.3926200, 'Kankurgachi, Kolkata, West Bengal', 271, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/2-030.jpg', NULL, NULL),
(37, 'Phoolbagan Drinking Water Point', 3, 22.5785800, 88.3948100, 'Phoolbagan, Kolkata, West Bengal', 281, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-031.jpg', NULL, NULL),
(38, 'Baguiati Public Parking Area', 4, 22.6167900, 88.4320000, 'Baguiati, Kolkata, West Bengal', 455, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-032.jpg', NULL, NULL),
(39, 'Lake Town Community Dustbin', 1, 22.6060000, 88.4021900, 'Lake Town, Kolkata, West Bengal', 297, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-033.jpg', NULL, NULL),
(40, 'Kestopur Public Toilet', 2, 22.6052100, 88.4253800, 'Kestopur, Kolkata, West Bengal', 307, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/2-034.jpg', NULL, NULL),
(41, 'New Town Drinking Water Point', 3, 22.5804200, 88.4705700, 'New Town, Kolkata, West Bengal', 317, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/3-035.jpg', NULL, NULL),
(42, 'Rajarhat Public Parking Area', 4, 22.6205800, 88.4674300, 'Rajarhat, Kolkata, West Bengal', 467, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-036.jpg', NULL, NULL),
(43, 'Bidhannagar Community Dustbin', 1, 22.5857900, 88.4166200, 'Bidhannagar, Kolkata, West Bengal', 333, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-037.jpg', NULL, NULL),
(44, 'Chinar Park Public Toilet', 2, 22.6230000, 88.4488100, 'Chinar Park, Kolkata, West Bengal', 343, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-038.jpg', NULL, NULL),
(45, 'Garden Reach Drinking Water Point', 3, 22.5442100, 88.2830000, 'Garden Reach, Kolkata, West Bengal', 353, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/3-039.jpg', NULL, NULL),
(46, 'Metiabruz Public Parking Area', 4, 22.5544200, 88.2671900, 'Metiabruz, Kolkata, West Bengal', 479, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/4-040.jpg', NULL, NULL),
(47, 'Taratala Community Dustbin', 1, 22.5095800, 88.3153800, 'Taratala, Kolkata, West Bengal', 369, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-041.jpg', NULL, NULL),
(48, 'Kidderpore Public Toilet', 2, 22.5377900, 88.3215700, 'Kidderpore, Kolkata, West Bengal', 379, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-042.jpg', NULL, NULL),
(49, 'Chetla Drinking Water Point', 3, 22.5150000, 88.3324300, 'Chetla, Kolkata, West Bengal', 389, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-043.jpg', NULL, NULL),
(50, 'Rabindra Sarobar Public Parking Area', 4, 22.5072100, 88.3456200, 'Rabindra Sarobar, Kolkata, West Bengal', 491, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/4-044.jpg', NULL, NULL),
(51, 'Minto Park Community Dustbin', 1, 22.5444200, 88.3538100, 'Minto Park, Kolkata, West Bengal', 405, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/1-045.jpg', NULL, NULL),
(52, 'Theatre Road Public Toilet', 2, 22.5455800, 88.3510000, 'Theatre Road, Kolkata, West Bengal', 415, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-046.jpg', NULL, NULL),
(53, 'Bentinck Street Drinking Water Point', 3, 22.5657900, 88.3501900, 'Bentinck Street, Kolkata, West Bengal', 425, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-047.jpg', NULL, NULL),
(54, 'Strand Road Public Parking Area', 4, 22.5720000, 88.3413800, 'Strand Road, Kolkata, West Bengal', 503, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-048.jpg', NULL, NULL),
(55, 'Bagbazar Community Dustbin', 1, 22.6012100, 88.3655700, 'Bagbazar, Kolkata, West Bengal', 518, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/1-049.jpg', NULL, NULL),
(56, 'Ahiritola Public Toilet', 2, 22.5924200, 88.3554300, 'Ahiritola, Kolkata, West Bengal', 13, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/2-050.jpg', NULL, NULL),
(57, 'Sinthee Drinking Water Point', 3, 22.6235800, 88.3826200, 'Sinthee, Kolkata, West Bengal', 23, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/3-051.jpg', NULL, NULL),
(58, 'Cossipore Public Parking Area', 4, 22.6137900, 88.3758100, 'Cossipore, Kolkata, West Bengal', 515, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-052.jpg', NULL, NULL),
(59, 'Baranagar Community Dustbin', 1, 22.6410000, 88.3650000, 'Baranagar, Kolkata, West Bengal', 39, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-053.jpg', NULL, NULL),
(60, 'Tala Public Toilet', 2, 22.6102100, 88.3891900, 'Tala, Kolkata, West Bengal', 49, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/2-054.jpg', NULL, NULL),
(61, 'Narkeldanga Drinking Water Point', 3, 22.5794200, 88.3793800, 'Narkeldanga, Kolkata, West Bengal', 59, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/3-055.jpg', NULL, NULL),
(62, 'Entally Public Parking Area', 4, 22.5555800, 88.3695700, 'Entally, Kolkata, West Bengal', 448, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/4-056.jpg', NULL, NULL),
(63, 'Mominpur Community Dustbin', 1, 22.5267900, 88.3144300, 'Mominpur, Kolkata, West Bengal', 75, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-057.jpg', NULL, NULL),
(64, 'Behala Chowrasta Public Toilet', 2, 22.4790000, 88.3206200, 'Behala Chowrasta, Kolkata, West Bengal', 85, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-058.jpg', NULL, NULL),
(65, 'Thakurpukur Drinking Water Point', 3, 22.4532100, 88.3048100, 'Thakurpukur, Kolkata, West Bengal', 95, 'UNDER_REPAIR', '2026-10-14 06:30:00', '/uploads/facilities/3-059.jpg', NULL, NULL),
(66, 'Garia Public Parking Area', 4, 22.4634200, 88.3910000, 'Garia, Kolkata, West Bengal', 460, 'SUSPENDED', '2026-10-14 06:30:00', '/uploads/facilities/4-060.jpg', NULL, NULL),
(67, 'Bansdroni Community Dustbin', 1, 22.4715800, 88.3671900, 'Bansdroni, Kolkata, West Bengal', 111, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/1-061.jpg', NULL, NULL),
(68, 'Narendrapur Public Toilet', 2, 22.4417900, 88.3933800, 'Narendrapur, Kolkata, West Bengal', 121, 'OPEN', '2026-10-14 06:30:00', '/uploads/facilities/2-062.jpg', NULL, NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `assigned_agent` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recommendations`
--

INSERT INTO `recommendations` (`recommendation_id`, `user_id`, `category_id`, `title`, `description`, `latitude`, `longitude`, `address`, `photo_url`, `status`, `assigned_agency`, `created_at`, `assigned_agent`) VALUES
(1, 11, 1, 'Need new dustbin near College Street', 'Booksellers and students lack dustbins.', 22.5744000, 88.3629000, 'College Street, Kolkata', '', 'ALLOCATED', 1, '2026-10-14 07:40:57', 9),
(2, 11, 1, 'Need new dustbin near Gariahat Pantaloons', 'High footfall shoppers dumping plastic waste on footpath.', 22.5186000, 88.3653000, 'Gariahat Crossing, Kolkata', '', 'ALLOCATED', 1, '2026-10-14 07:44:36', 518),
(3, 11, 4, 'Need two-wheeler parking spot near Howrah Station', 'Severe parking congestion along station approach road.', 22.5855000, 88.3426000, 'Howrah Station Approach Road', '', 'ALLOCATED', 4, '2026-10-14 07:44:50', 525),
(4, 11, 1, 'Need New Segregated Waste Bins', 'Heavy footfall near Shyambazar tram terminus leads to waste littering.', 22.6042000, 88.3734000, 'Shyambazar 5-point crossing, Kolkata (Landmark: Near Netaji Statue)', '/uploads/recommendations/test_rec.jpg', 'ALLOCATED', 1, '2026-10-14 08:22:29', 518);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `assigned_agent` int(10) UNSIGNED DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `investigation_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `facility_id`, `user_id`, `title`, `description`, `photo_url`, `status`, `assigned_agency`, `created_at`, `assigned_agent`, `resolved_at`, `investigation_notes`) VALUES
(1, 2, 11, 'Dustbin overflowing heavily', 'Waste scattered around Gariahat market junction.', '/uploads/reports/sample.jpg', 'PENDING', 1, '2026-10-14 07:44:36', 518, NULL, NULL),
(2, 1, 11, 'Leaking tap and broken flush', 'Water leaking continuously on College Street toilet.', '/uploads/reports/test_report.jpg', 'PENDING', 2, '2026-10-14 08:22:29', 520, NULL, NULL);

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
  `verification_status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `description` text DEFAULT NULL,
  `completion_date` date DEFAULT NULL
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
(11, 'KMC Ward 1 SWM Demo Agent', 'demo.kmc.ward1.swm@example.com', '9000000011', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(12, 'KMC Ward 1 Sanitation Demo Agent', 'demo.kmc.ward1.sanitation@example.com', '9000000012', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(13, 'KMC Ward 1 Water Demo Agent', 'demo.kmc.ward1.water@example.com', '9000000013', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(14, 'KMC Ward 2 SWM Demo Agent', 'demo.kmc.ward2.swm@example.com', '9000000014', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(15, 'KMC Ward 2 Sanitation Demo Agent', 'demo.kmc.ward2.sanitation@example.com', '9000000015', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(16, 'KMC Ward 2 Water Demo Agent', 'demo.kmc.ward2.water@example.com', '9000000016', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(17, 'KMC Ward 3 SWM Demo Agent', 'demo.kmc.ward3.swm@example.com', '9000000017', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(18, 'KMC Ward 3 Sanitation Demo Agent', 'demo.kmc.ward3.sanitation@example.com', '9000000018', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(19, 'KMC Ward 3 Water Demo Agent', 'demo.kmc.ward3.water@example.com', '9000000019', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(20, 'KMC Ward 4 SWM Demo Agent', 'demo.kmc.ward4.swm@example.com', '9000000020', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(21, 'KMC Ward 4 Sanitation Demo Agent', 'demo.kmc.ward4.sanitation@example.com', '9000000021', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(22, 'KMC Ward 4 Water Demo Agent', 'demo.kmc.ward4.water@example.com', '9000000022', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(23, 'KMC Ward 5 SWM Demo Agent', 'demo.kmc.ward5.swm@example.com', '9000000023', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(24, 'KMC Ward 5 Sanitation Demo Agent', 'demo.kmc.ward5.sanitation@example.com', '9000000024', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(25, 'KMC Ward 5 Water Demo Agent', 'demo.kmc.ward5.water@example.com', '9000000025', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(26, 'KMC Ward 6 SWM Demo Agent', 'demo.kmc.ward6.swm@example.com', '9000000026', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(27, 'KMC Ward 6 Sanitation Demo Agent', 'demo.kmc.ward6.sanitation@example.com', '9000000027', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(28, 'KMC Ward 6 Water Demo Agent', 'demo.kmc.ward6.water@example.com', '9000000028', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(29, 'KMC Ward 7 SWM Demo Agent', 'demo.kmc.ward7.swm@example.com', '9000000029', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(30, 'KMC Ward 7 Sanitation Demo Agent', 'demo.kmc.ward7.sanitation@example.com', '9000000030', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(31, 'KMC Ward 7 Water Demo Agent', 'demo.kmc.ward7.water@example.com', '9000000031', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(32, 'KMC Ward 8 SWM Demo Agent', 'demo.kmc.ward8.swm@example.com', '9000000032', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(33, 'KMC Ward 8 Sanitation Demo Agent', 'demo.kmc.ward8.sanitation@example.com', '9000000033', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(34, 'KMC Ward 8 Water Demo Agent', 'demo.kmc.ward8.water@example.com', '9000000034', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(35, 'KMC Ward 9 SWM Demo Agent', 'demo.kmc.ward9.swm@example.com', '9000000035', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(36, 'KMC Ward 9 Sanitation Demo Agent', 'demo.kmc.ward9.sanitation@example.com', '9000000036', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(37, 'KMC Ward 9 Water Demo Agent', 'demo.kmc.ward9.water@example.com', '9000000037', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(38, 'KMC Ward 10 SWM Demo Agent', 'demo.kmc.ward10.swm@example.com', '9000000038', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(39, 'KMC Ward 10 Sanitation Demo Agent', 'demo.kmc.ward10.sanitation@example.com', '9000000039', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(40, 'KMC Ward 10 Water Demo Agent', 'demo.kmc.ward10.water@example.com', '9000000040', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(41, 'KMC Ward 11 SWM Demo Agent', 'demo.kmc.ward11.swm@example.com', '9000000041', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(42, 'KMC Ward 11 Sanitation Demo Agent', 'demo.kmc.ward11.sanitation@example.com', '9000000042', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(43, 'KMC Ward 11 Water Demo Agent', 'demo.kmc.ward11.water@example.com', '9000000043', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(44, 'KMC Ward 12 SWM Demo Agent', 'demo.kmc.ward12.swm@example.com', '9000000044', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(45, 'KMC Ward 12 Sanitation Demo Agent', 'demo.kmc.ward12.sanitation@example.com', '9000000045', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(46, 'KMC Ward 12 Water Demo Agent', 'demo.kmc.ward12.water@example.com', '9000000046', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(47, 'KMC Ward 13 SWM Demo Agent', 'demo.kmc.ward13.swm@example.com', '9000000047', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(48, 'KMC Ward 13 Sanitation Demo Agent', 'demo.kmc.ward13.sanitation@example.com', '9000000048', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(49, 'KMC Ward 13 Water Demo Agent', 'demo.kmc.ward13.water@example.com', '9000000049', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(50, 'KMC Ward 14 SWM Demo Agent', 'demo.kmc.ward14.swm@example.com', '9000000050', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(51, 'KMC Ward 14 Sanitation Demo Agent', 'demo.kmc.ward14.sanitation@example.com', '9000000051', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(52, 'KMC Ward 14 Water Demo Agent', 'demo.kmc.ward14.water@example.com', '9000000052', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(53, 'KMC Ward 15 SWM Demo Agent', 'demo.kmc.ward15.swm@example.com', '9000000053', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(54, 'KMC Ward 15 Sanitation Demo Agent', 'demo.kmc.ward15.sanitation@example.com', '9000000054', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(55, 'KMC Ward 15 Water Demo Agent', 'demo.kmc.ward15.water@example.com', '9000000055', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(56, 'KMC Ward 16 SWM Demo Agent', 'demo.kmc.ward16.swm@example.com', '9000000056', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(57, 'KMC Ward 16 Sanitation Demo Agent', 'demo.kmc.ward16.sanitation@example.com', '9000000057', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(58, 'KMC Ward 16 Water Demo Agent', 'demo.kmc.ward16.water@example.com', '9000000058', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(59, 'KMC Ward 17 SWM Demo Agent', 'demo.kmc.ward17.swm@example.com', '9000000059', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(60, 'KMC Ward 17 Sanitation Demo Agent', 'demo.kmc.ward17.sanitation@example.com', '9000000060', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(61, 'KMC Ward 17 Water Demo Agent', 'demo.kmc.ward17.water@example.com', '9000000061', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(62, 'KMC Ward 18 SWM Demo Agent', 'demo.kmc.ward18.swm@example.com', '9000000062', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(63, 'KMC Ward 18 Sanitation Demo Agent', 'demo.kmc.ward18.sanitation@example.com', '9000000063', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(64, 'KMC Ward 18 Water Demo Agent', 'demo.kmc.ward18.water@example.com', '9000000064', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(65, 'KMC Ward 19 SWM Demo Agent', 'demo.kmc.ward19.swm@example.com', '9000000065', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(66, 'KMC Ward 19 Sanitation Demo Agent', 'demo.kmc.ward19.sanitation@example.com', '9000000066', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(67, 'KMC Ward 19 Water Demo Agent', 'demo.kmc.ward19.water@example.com', '9000000067', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(68, 'KMC Ward 20 SWM Demo Agent', 'demo.kmc.ward20.swm@example.com', '9000000068', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(69, 'KMC Ward 20 Sanitation Demo Agent', 'demo.kmc.ward20.sanitation@example.com', '9000000069', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(70, 'KMC Ward 20 Water Demo Agent', 'demo.kmc.ward20.water@example.com', '9000000070', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(71, 'KMC Ward 21 SWM Demo Agent', 'demo.kmc.ward21.swm@example.com', '9000000071', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(72, 'KMC Ward 21 Sanitation Demo Agent', 'demo.kmc.ward21.sanitation@example.com', '9000000072', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(73, 'KMC Ward 21 Water Demo Agent', 'demo.kmc.ward21.water@example.com', '9000000073', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(74, 'KMC Ward 22 SWM Demo Agent', 'demo.kmc.ward22.swm@example.com', '9000000074', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(75, 'KMC Ward 22 Sanitation Demo Agent', 'demo.kmc.ward22.sanitation@example.com', '9000000075', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(76, 'KMC Ward 22 Water Demo Agent', 'demo.kmc.ward22.water@example.com', '9000000076', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(77, 'KMC Ward 23 SWM Demo Agent', 'demo.kmc.ward23.swm@example.com', '9000000077', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(78, 'KMC Ward 23 Sanitation Demo Agent', 'demo.kmc.ward23.sanitation@example.com', '9000000078', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(79, 'KMC Ward 23 Water Demo Agent', 'demo.kmc.ward23.water@example.com', '9000000079', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(80, 'KMC Ward 24 SWM Demo Agent', 'demo.kmc.ward24.swm@example.com', '9000000080', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(81, 'KMC Ward 24 Sanitation Demo Agent', 'demo.kmc.ward24.sanitation@example.com', '9000000081', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(82, 'KMC Ward 24 Water Demo Agent', 'demo.kmc.ward24.water@example.com', '9000000082', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(83, 'KMC Ward 25 SWM Demo Agent', 'demo.kmc.ward25.swm@example.com', '9000000083', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(84, 'KMC Ward 25 Sanitation Demo Agent', 'demo.kmc.ward25.sanitation@example.com', '9000000084', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(85, 'KMC Ward 25 Water Demo Agent', 'demo.kmc.ward25.water@example.com', '9000000085', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(86, 'KMC Ward 26 SWM Demo Agent', 'demo.kmc.ward26.swm@example.com', '9000000086', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(87, 'KMC Ward 26 Sanitation Demo Agent', 'demo.kmc.ward26.sanitation@example.com', '9000000087', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(88, 'KMC Ward 26 Water Demo Agent', 'demo.kmc.ward26.water@example.com', '9000000088', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(89, 'KMC Ward 27 SWM Demo Agent', 'demo.kmc.ward27.swm@example.com', '9000000089', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(90, 'KMC Ward 27 Sanitation Demo Agent', 'demo.kmc.ward27.sanitation@example.com', '9000000090', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(91, 'KMC Ward 27 Water Demo Agent', 'demo.kmc.ward27.water@example.com', '9000000091', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(92, 'KMC Ward 28 SWM Demo Agent', 'demo.kmc.ward28.swm@example.com', '9000000092', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(93, 'KMC Ward 28 Sanitation Demo Agent', 'demo.kmc.ward28.sanitation@example.com', '9000000093', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(94, 'KMC Ward 28 Water Demo Agent', 'demo.kmc.ward28.water@example.com', '9000000094', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(95, 'KMC Ward 29 SWM Demo Agent', 'demo.kmc.ward29.swm@example.com', '9000000095', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(96, 'KMC Ward 29 Sanitation Demo Agent', 'demo.kmc.ward29.sanitation@example.com', '9000000096', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(97, 'KMC Ward 29 Water Demo Agent', 'demo.kmc.ward29.water@example.com', '9000000097', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(98, 'KMC Ward 30 SWM Demo Agent', 'demo.kmc.ward30.swm@example.com', '9000000098', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(99, 'KMC Ward 30 Sanitation Demo Agent', 'demo.kmc.ward30.sanitation@example.com', '9000000099', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(100, 'KMC Ward 30 Water Demo Agent', 'demo.kmc.ward30.water@example.com', '9000000100', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(101, 'KMC Ward 31 SWM Demo Agent', 'demo.kmc.ward31.swm@example.com', '9000000101', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(102, 'KMC Ward 31 Sanitation Demo Agent', 'demo.kmc.ward31.sanitation@example.com', '9000000102', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(103, 'KMC Ward 31 Water Demo Agent', 'demo.kmc.ward31.water@example.com', '9000000103', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(104, 'KMC Ward 32 SWM Demo Agent', 'demo.kmc.ward32.swm@example.com', '9000000104', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(105, 'KMC Ward 32 Sanitation Demo Agent', 'demo.kmc.ward32.sanitation@example.com', '9000000105', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(106, 'KMC Ward 32 Water Demo Agent', 'demo.kmc.ward32.water@example.com', '9000000106', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(107, 'KMC Ward 33 SWM Demo Agent', 'demo.kmc.ward33.swm@example.com', '9000000107', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(108, 'KMC Ward 33 Sanitation Demo Agent', 'demo.kmc.ward33.sanitation@example.com', '9000000108', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(109, 'KMC Ward 33 Water Demo Agent', 'demo.kmc.ward33.water@example.com', '9000000109', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(110, 'KMC Ward 34 SWM Demo Agent', 'demo.kmc.ward34.swm@example.com', '9000000110', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(111, 'KMC Ward 34 Sanitation Demo Agent', 'demo.kmc.ward34.sanitation@example.com', '9000000111', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(112, 'KMC Ward 34 Water Demo Agent', 'demo.kmc.ward34.water@example.com', '9000000112', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(113, 'KMC Ward 35 SWM Demo Agent', 'demo.kmc.ward35.swm@example.com', '9000000113', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(114, 'KMC Ward 35 Sanitation Demo Agent', 'demo.kmc.ward35.sanitation@example.com', '9000000114', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(115, 'KMC Ward 35 Water Demo Agent', 'demo.kmc.ward35.water@example.com', '9000000115', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(116, 'KMC Ward 36 SWM Demo Agent', 'demo.kmc.ward36.swm@example.com', '9000000116', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(117, 'KMC Ward 36 Sanitation Demo Agent', 'demo.kmc.ward36.sanitation@example.com', '9000000117', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(118, 'KMC Ward 36 Water Demo Agent', 'demo.kmc.ward36.water@example.com', '9000000118', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(119, 'KMC Ward 37 SWM Demo Agent', 'demo.kmc.ward37.swm@example.com', '9000000119', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(120, 'KMC Ward 37 Sanitation Demo Agent', 'demo.kmc.ward37.sanitation@example.com', '9000000120', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(121, 'KMC Ward 37 Water Demo Agent', 'demo.kmc.ward37.water@example.com', '9000000121', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(122, 'KMC Ward 38 SWM Demo Agent', 'demo.kmc.ward38.swm@example.com', '9000000122', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(123, 'KMC Ward 38 Sanitation Demo Agent', 'demo.kmc.ward38.sanitation@example.com', '9000000123', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(124, 'KMC Ward 38 Water Demo Agent', 'demo.kmc.ward38.water@example.com', '9000000124', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(125, 'KMC Ward 39 SWM Demo Agent', 'demo.kmc.ward39.swm@example.com', '9000000125', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(126, 'KMC Ward 39 Sanitation Demo Agent', 'demo.kmc.ward39.sanitation@example.com', '9000000126', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(127, 'KMC Ward 39 Water Demo Agent', 'demo.kmc.ward39.water@example.com', '9000000127', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(128, 'KMC Ward 40 SWM Demo Agent', 'demo.kmc.ward40.swm@example.com', '9000000128', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(129, 'KMC Ward 40 Sanitation Demo Agent', 'demo.kmc.ward40.sanitation@example.com', '9000000129', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(130, 'KMC Ward 40 Water Demo Agent', 'demo.kmc.ward40.water@example.com', '9000000130', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(131, 'KMC Ward 41 SWM Demo Agent', 'demo.kmc.ward41.swm@example.com', '9000000131', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(132, 'KMC Ward 41 Sanitation Demo Agent', 'demo.kmc.ward41.sanitation@example.com', '9000000132', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(133, 'KMC Ward 41 Water Demo Agent', 'demo.kmc.ward41.water@example.com', '9000000133', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(134, 'KMC Ward 42 SWM Demo Agent', 'demo.kmc.ward42.swm@example.com', '9000000134', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(135, 'KMC Ward 42 Sanitation Demo Agent', 'demo.kmc.ward42.sanitation@example.com', '9000000135', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(136, 'KMC Ward 42 Water Demo Agent', 'demo.kmc.ward42.water@example.com', '9000000136', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(137, 'KMC Ward 43 SWM Demo Agent', 'demo.kmc.ward43.swm@example.com', '9000000137', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(138, 'KMC Ward 43 Sanitation Demo Agent', 'demo.kmc.ward43.sanitation@example.com', '9000000138', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(139, 'KMC Ward 43 Water Demo Agent', 'demo.kmc.ward43.water@example.com', '9000000139', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(140, 'KMC Ward 44 SWM Demo Agent', 'demo.kmc.ward44.swm@example.com', '9000000140', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(141, 'KMC Ward 44 Sanitation Demo Agent', 'demo.kmc.ward44.sanitation@example.com', '9000000141', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(142, 'KMC Ward 44 Water Demo Agent', 'demo.kmc.ward44.water@example.com', '9000000142', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(143, 'KMC Ward 45 SWM Demo Agent', 'demo.kmc.ward45.swm@example.com', '9000000143', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(144, 'KMC Ward 45 Sanitation Demo Agent', 'demo.kmc.ward45.sanitation@example.com', '9000000144', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(145, 'KMC Ward 45 Water Demo Agent', 'demo.kmc.ward45.water@example.com', '9000000145', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(146, 'KMC Ward 46 SWM Demo Agent', 'demo.kmc.ward46.swm@example.com', '9000000146', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(147, 'KMC Ward 46 Sanitation Demo Agent', 'demo.kmc.ward46.sanitation@example.com', '9000000147', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(148, 'KMC Ward 46 Water Demo Agent', 'demo.kmc.ward46.water@example.com', '9000000148', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(149, 'KMC Ward 47 SWM Demo Agent', 'demo.kmc.ward47.swm@example.com', '9000000149', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(150, 'KMC Ward 47 Sanitation Demo Agent', 'demo.kmc.ward47.sanitation@example.com', '9000000150', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(151, 'KMC Ward 47 Water Demo Agent', 'demo.kmc.ward47.water@example.com', '9000000151', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(152, 'KMC Ward 48 SWM Demo Agent', 'demo.kmc.ward48.swm@example.com', '9000000152', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(153, 'KMC Ward 48 Sanitation Demo Agent', 'demo.kmc.ward48.sanitation@example.com', '9000000153', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(154, 'KMC Ward 48 Water Demo Agent', 'demo.kmc.ward48.water@example.com', '9000000154', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(155, 'KMC Ward 49 SWM Demo Agent', 'demo.kmc.ward49.swm@example.com', '9000000155', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(156, 'KMC Ward 49 Sanitation Demo Agent', 'demo.kmc.ward49.sanitation@example.com', '9000000156', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(157, 'KMC Ward 49 Water Demo Agent', 'demo.kmc.ward49.water@example.com', '9000000157', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(158, 'KMC Ward 50 SWM Demo Agent', 'demo.kmc.ward50.swm@example.com', '9000000158', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(159, 'KMC Ward 50 Sanitation Demo Agent', 'demo.kmc.ward50.sanitation@example.com', '9000000159', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(160, 'KMC Ward 50 Water Demo Agent', 'demo.kmc.ward50.water@example.com', '9000000160', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(161, 'KMC Ward 51 SWM Demo Agent', 'demo.kmc.ward51.swm@example.com', '9000000161', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(162, 'KMC Ward 51 Sanitation Demo Agent', 'demo.kmc.ward51.sanitation@example.com', '9000000162', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(163, 'KMC Ward 51 Water Demo Agent', 'demo.kmc.ward51.water@example.com', '9000000163', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(164, 'KMC Ward 52 SWM Demo Agent', 'demo.kmc.ward52.swm@example.com', '9000000164', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(165, 'KMC Ward 52 Sanitation Demo Agent', 'demo.kmc.ward52.sanitation@example.com', '9000000165', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(166, 'KMC Ward 52 Water Demo Agent', 'demo.kmc.ward52.water@example.com', '9000000166', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(167, 'KMC Ward 53 SWM Demo Agent', 'demo.kmc.ward53.swm@example.com', '9000000167', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(168, 'KMC Ward 53 Sanitation Demo Agent', 'demo.kmc.ward53.sanitation@example.com', '9000000168', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(169, 'KMC Ward 53 Water Demo Agent', 'demo.kmc.ward53.water@example.com', '9000000169', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(170, 'KMC Ward 54 SWM Demo Agent', 'demo.kmc.ward54.swm@example.com', '9000000170', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(171, 'KMC Ward 54 Sanitation Demo Agent', 'demo.kmc.ward54.sanitation@example.com', '9000000171', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(172, 'KMC Ward 54 Water Demo Agent', 'demo.kmc.ward54.water@example.com', '9000000172', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(173, 'KMC Ward 55 SWM Demo Agent', 'demo.kmc.ward55.swm@example.com', '9000000173', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(174, 'KMC Ward 55 Sanitation Demo Agent', 'demo.kmc.ward55.sanitation@example.com', '9000000174', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(175, 'KMC Ward 55 Water Demo Agent', 'demo.kmc.ward55.water@example.com', '9000000175', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(176, 'KMC Ward 56 SWM Demo Agent', 'demo.kmc.ward56.swm@example.com', '9000000176', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(177, 'KMC Ward 56 Sanitation Demo Agent', 'demo.kmc.ward56.sanitation@example.com', '9000000177', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(178, 'KMC Ward 56 Water Demo Agent', 'demo.kmc.ward56.water@example.com', '9000000178', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(179, 'KMC Ward 57 SWM Demo Agent', 'demo.kmc.ward57.swm@example.com', '9000000179', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(180, 'KMC Ward 57 Sanitation Demo Agent', 'demo.kmc.ward57.sanitation@example.com', '9000000180', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(181, 'KMC Ward 57 Water Demo Agent', 'demo.kmc.ward57.water@example.com', '9000000181', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(182, 'KMC Ward 58 SWM Demo Agent', 'demo.kmc.ward58.swm@example.com', '9000000182', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(183, 'KMC Ward 58 Sanitation Demo Agent', 'demo.kmc.ward58.sanitation@example.com', '9000000183', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(184, 'KMC Ward 58 Water Demo Agent', 'demo.kmc.ward58.water@example.com', '9000000184', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(185, 'KMC Ward 59 SWM Demo Agent', 'demo.kmc.ward59.swm@example.com', '9000000185', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(186, 'KMC Ward 59 Sanitation Demo Agent', 'demo.kmc.ward59.sanitation@example.com', '9000000186', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(187, 'KMC Ward 59 Water Demo Agent', 'demo.kmc.ward59.water@example.com', '9000000187', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(188, 'KMC Ward 60 SWM Demo Agent', 'demo.kmc.ward60.swm@example.com', '9000000188', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(189, 'KMC Ward 60 Sanitation Demo Agent', 'demo.kmc.ward60.sanitation@example.com', '9000000189', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(190, 'KMC Ward 60 Water Demo Agent', 'demo.kmc.ward60.water@example.com', '9000000190', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(191, 'KMC Ward 61 SWM Demo Agent', 'demo.kmc.ward61.swm@example.com', '9000000191', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(192, 'KMC Ward 61 Sanitation Demo Agent', 'demo.kmc.ward61.sanitation@example.com', '9000000192', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(193, 'KMC Ward 61 Water Demo Agent', 'demo.kmc.ward61.water@example.com', '9000000193', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(194, 'KMC Ward 62 SWM Demo Agent', 'demo.kmc.ward62.swm@example.com', '9000000194', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(195, 'KMC Ward 62 Sanitation Demo Agent', 'demo.kmc.ward62.sanitation@example.com', '9000000195', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(196, 'KMC Ward 62 Water Demo Agent', 'demo.kmc.ward62.water@example.com', '9000000196', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(197, 'KMC Ward 63 SWM Demo Agent', 'demo.kmc.ward63.swm@example.com', '9000000197', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(198, 'KMC Ward 63 Sanitation Demo Agent', 'demo.kmc.ward63.sanitation@example.com', '9000000198', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(199, 'KMC Ward 63 Water Demo Agent', 'demo.kmc.ward63.water@example.com', '9000000199', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(200, 'KMC Ward 64 SWM Demo Agent', 'demo.kmc.ward64.swm@example.com', '9000000200', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(201, 'KMC Ward 64 Sanitation Demo Agent', 'demo.kmc.ward64.sanitation@example.com', '9000000201', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(202, 'KMC Ward 64 Water Demo Agent', 'demo.kmc.ward64.water@example.com', '9000000202', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(203, 'KMC Ward 65 SWM Demo Agent', 'demo.kmc.ward65.swm@example.com', '9000000203', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(204, 'KMC Ward 65 Sanitation Demo Agent', 'demo.kmc.ward65.sanitation@example.com', '9000000204', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(205, 'KMC Ward 65 Water Demo Agent', 'demo.kmc.ward65.water@example.com', '9000000205', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(206, 'KMC Ward 66 SWM Demo Agent', 'demo.kmc.ward66.swm@example.com', '9000000206', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(207, 'KMC Ward 66 Sanitation Demo Agent', 'demo.kmc.ward66.sanitation@example.com', '9000000207', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(208, 'KMC Ward 66 Water Demo Agent', 'demo.kmc.ward66.water@example.com', '9000000208', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(209, 'KMC Ward 67 SWM Demo Agent', 'demo.kmc.ward67.swm@example.com', '9000000209', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(210, 'KMC Ward 67 Sanitation Demo Agent', 'demo.kmc.ward67.sanitation@example.com', '9000000210', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(211, 'KMC Ward 67 Water Demo Agent', 'demo.kmc.ward67.water@example.com', '9000000211', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(212, 'KMC Ward 68 SWM Demo Agent', 'demo.kmc.ward68.swm@example.com', '9000000212', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(213, 'KMC Ward 68 Sanitation Demo Agent', 'demo.kmc.ward68.sanitation@example.com', '9000000213', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(214, 'KMC Ward 68 Water Demo Agent', 'demo.kmc.ward68.water@example.com', '9000000214', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(215, 'KMC Ward 69 SWM Demo Agent', 'demo.kmc.ward69.swm@example.com', '9000000215', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(216, 'KMC Ward 69 Sanitation Demo Agent', 'demo.kmc.ward69.sanitation@example.com', '9000000216', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(217, 'KMC Ward 69 Water Demo Agent', 'demo.kmc.ward69.water@example.com', '9000000217', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(218, 'KMC Ward 70 SWM Demo Agent', 'demo.kmc.ward70.swm@example.com', '9000000218', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(219, 'KMC Ward 70 Sanitation Demo Agent', 'demo.kmc.ward70.sanitation@example.com', '9000000219', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(220, 'KMC Ward 70 Water Demo Agent', 'demo.kmc.ward70.water@example.com', '9000000220', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(221, 'KMC Ward 71 SWM Demo Agent', 'demo.kmc.ward71.swm@example.com', '9000000221', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(222, 'KMC Ward 71 Sanitation Demo Agent', 'demo.kmc.ward71.sanitation@example.com', '9000000222', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(223, 'KMC Ward 71 Water Demo Agent', 'demo.kmc.ward71.water@example.com', '9000000223', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(224, 'KMC Ward 72 SWM Demo Agent', 'demo.kmc.ward72.swm@example.com', '9000000224', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(225, 'KMC Ward 72 Sanitation Demo Agent', 'demo.kmc.ward72.sanitation@example.com', '9000000225', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(226, 'KMC Ward 72 Water Demo Agent', 'demo.kmc.ward72.water@example.com', '9000000226', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(227, 'KMC Ward 73 SWM Demo Agent', 'demo.kmc.ward73.swm@example.com', '9000000227', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(228, 'KMC Ward 73 Sanitation Demo Agent', 'demo.kmc.ward73.sanitation@example.com', '9000000228', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(229, 'KMC Ward 73 Water Demo Agent', 'demo.kmc.ward73.water@example.com', '9000000229', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(230, 'KMC Ward 74 SWM Demo Agent', 'demo.kmc.ward74.swm@example.com', '9000000230', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(231, 'KMC Ward 74 Sanitation Demo Agent', 'demo.kmc.ward74.sanitation@example.com', '9000000231', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(232, 'KMC Ward 74 Water Demo Agent', 'demo.kmc.ward74.water@example.com', '9000000232', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(233, 'KMC Ward 75 SWM Demo Agent', 'demo.kmc.ward75.swm@example.com', '9000000233', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(234, 'KMC Ward 75 Sanitation Demo Agent', 'demo.kmc.ward75.sanitation@example.com', '9000000234', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(235, 'KMC Ward 75 Water Demo Agent', 'demo.kmc.ward75.water@example.com', '9000000235', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(236, 'KMC Ward 76 SWM Demo Agent', 'demo.kmc.ward76.swm@example.com', '9000000236', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(237, 'KMC Ward 76 Sanitation Demo Agent', 'demo.kmc.ward76.sanitation@example.com', '9000000237', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(238, 'KMC Ward 76 Water Demo Agent', 'demo.kmc.ward76.water@example.com', '9000000238', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(239, 'KMC Ward 77 SWM Demo Agent', 'demo.kmc.ward77.swm@example.com', '9000000239', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(240, 'KMC Ward 77 Sanitation Demo Agent', 'demo.kmc.ward77.sanitation@example.com', '9000000240', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(241, 'KMC Ward 77 Water Demo Agent', 'demo.kmc.ward77.water@example.com', '9000000241', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(242, 'KMC Ward 78 SWM Demo Agent', 'demo.kmc.ward78.swm@example.com', '9000000242', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(243, 'KMC Ward 78 Sanitation Demo Agent', 'demo.kmc.ward78.sanitation@example.com', '9000000243', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(244, 'KMC Ward 78 Water Demo Agent', 'demo.kmc.ward78.water@example.com', '9000000244', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(245, 'KMC Ward 79 SWM Demo Agent', 'demo.kmc.ward79.swm@example.com', '9000000245', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(246, 'KMC Ward 79 Sanitation Demo Agent', 'demo.kmc.ward79.sanitation@example.com', '9000000246', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(247, 'KMC Ward 79 Water Demo Agent', 'demo.kmc.ward79.water@example.com', '9000000247', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(248, 'KMC Ward 80 SWM Demo Agent', 'demo.kmc.ward80.swm@example.com', '9000000248', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(249, 'KMC Ward 80 Sanitation Demo Agent', 'demo.kmc.ward80.sanitation@example.com', '9000000249', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(250, 'KMC Ward 80 Water Demo Agent', 'demo.kmc.ward80.water@example.com', '9000000250', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(251, 'KMC Ward 81 SWM Demo Agent', 'demo.kmc.ward81.swm@example.com', '9000000251', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(252, 'KMC Ward 81 Sanitation Demo Agent', 'demo.kmc.ward81.sanitation@example.com', '9000000252', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(253, 'KMC Ward 81 Water Demo Agent', 'demo.kmc.ward81.water@example.com', '9000000253', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(254, 'KMC Ward 82 SWM Demo Agent', 'demo.kmc.ward82.swm@example.com', '9000000254', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(255, 'KMC Ward 82 Sanitation Demo Agent', 'demo.kmc.ward82.sanitation@example.com', '9000000255', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(256, 'KMC Ward 82 Water Demo Agent', 'demo.kmc.ward82.water@example.com', '9000000256', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(257, 'KMC Ward 83 SWM Demo Agent', 'demo.kmc.ward83.swm@example.com', '9000000257', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(258, 'KMC Ward 83 Sanitation Demo Agent', 'demo.kmc.ward83.sanitation@example.com', '9000000258', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(259, 'KMC Ward 83 Water Demo Agent', 'demo.kmc.ward83.water@example.com', '9000000259', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(260, 'KMC Ward 84 SWM Demo Agent', 'demo.kmc.ward84.swm@example.com', '9000000260', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(261, 'KMC Ward 84 Sanitation Demo Agent', 'demo.kmc.ward84.sanitation@example.com', '9000000261', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(262, 'KMC Ward 84 Water Demo Agent', 'demo.kmc.ward84.water@example.com', '9000000262', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(263, 'KMC Ward 85 SWM Demo Agent', 'demo.kmc.ward85.swm@example.com', '9000000263', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(264, 'KMC Ward 85 Sanitation Demo Agent', 'demo.kmc.ward85.sanitation@example.com', '9000000264', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(265, 'KMC Ward 85 Water Demo Agent', 'demo.kmc.ward85.water@example.com', '9000000265', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(266, 'KMC Ward 86 SWM Demo Agent', 'demo.kmc.ward86.swm@example.com', '9000000266', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(267, 'KMC Ward 86 Sanitation Demo Agent', 'demo.kmc.ward86.sanitation@example.com', '9000000267', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(268, 'KMC Ward 86 Water Demo Agent', 'demo.kmc.ward86.water@example.com', '9000000268', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(269, 'KMC Ward 87 SWM Demo Agent', 'demo.kmc.ward87.swm@example.com', '9000000269', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(270, 'KMC Ward 87 Sanitation Demo Agent', 'demo.kmc.ward87.sanitation@example.com', '9000000270', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(271, 'KMC Ward 87 Water Demo Agent', 'demo.kmc.ward87.water@example.com', '9000000271', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(272, 'KMC Ward 88 SWM Demo Agent', 'demo.kmc.ward88.swm@example.com', '9000000272', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(273, 'KMC Ward 88 Sanitation Demo Agent', 'demo.kmc.ward88.sanitation@example.com', '9000000273', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(274, 'KMC Ward 88 Water Demo Agent', 'demo.kmc.ward88.water@example.com', '9000000274', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(275, 'KMC Ward 89 SWM Demo Agent', 'demo.kmc.ward89.swm@example.com', '9000000275', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(276, 'KMC Ward 89 Sanitation Demo Agent', 'demo.kmc.ward89.sanitation@example.com', '9000000276', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(277, 'KMC Ward 89 Water Demo Agent', 'demo.kmc.ward89.water@example.com', '9000000277', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(278, 'KMC Ward 90 SWM Demo Agent', 'demo.kmc.ward90.swm@example.com', '9000000278', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(279, 'KMC Ward 90 Sanitation Demo Agent', 'demo.kmc.ward90.sanitation@example.com', '9000000279', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(280, 'KMC Ward 90 Water Demo Agent', 'demo.kmc.ward90.water@example.com', '9000000280', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(281, 'KMC Ward 91 SWM Demo Agent', 'demo.kmc.ward91.swm@example.com', '9000000281', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(282, 'KMC Ward 91 Sanitation Demo Agent', 'demo.kmc.ward91.sanitation@example.com', '9000000282', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(283, 'KMC Ward 91 Water Demo Agent', 'demo.kmc.ward91.water@example.com', '9000000283', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(284, 'KMC Ward 92 SWM Demo Agent', 'demo.kmc.ward92.swm@example.com', '9000000284', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(285, 'KMC Ward 92 Sanitation Demo Agent', 'demo.kmc.ward92.sanitation@example.com', '9000000285', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(286, 'KMC Ward 92 Water Demo Agent', 'demo.kmc.ward92.water@example.com', '9000000286', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(287, 'KMC Ward 93 SWM Demo Agent', 'demo.kmc.ward93.swm@example.com', '9000000287', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(288, 'KMC Ward 93 Sanitation Demo Agent', 'demo.kmc.ward93.sanitation@example.com', '9000000288', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(289, 'KMC Ward 93 Water Demo Agent', 'demo.kmc.ward93.water@example.com', '9000000289', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(290, 'KMC Ward 94 SWM Demo Agent', 'demo.kmc.ward94.swm@example.com', '9000000290', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(291, 'KMC Ward 94 Sanitation Demo Agent', 'demo.kmc.ward94.sanitation@example.com', '9000000291', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(292, 'KMC Ward 94 Water Demo Agent', 'demo.kmc.ward94.water@example.com', '9000000292', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(293, 'KMC Ward 95 SWM Demo Agent', 'demo.kmc.ward95.swm@example.com', '9000000293', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(294, 'KMC Ward 95 Sanitation Demo Agent', 'demo.kmc.ward95.sanitation@example.com', '9000000294', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(295, 'KMC Ward 95 Water Demo Agent', 'demo.kmc.ward95.water@example.com', '9000000295', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(296, 'KMC Ward 96 SWM Demo Agent', 'demo.kmc.ward96.swm@example.com', '9000000296', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(297, 'KMC Ward 96 Sanitation Demo Agent', 'demo.kmc.ward96.sanitation@example.com', '9000000297', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(298, 'KMC Ward 96 Water Demo Agent', 'demo.kmc.ward96.water@example.com', '9000000298', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(299, 'KMC Ward 97 SWM Demo Agent', 'demo.kmc.ward97.swm@example.com', '9000000299', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(300, 'KMC Ward 97 Sanitation Demo Agent', 'demo.kmc.ward97.sanitation@example.com', '9000000300', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(301, 'KMC Ward 97 Water Demo Agent', 'demo.kmc.ward97.water@example.com', '9000000301', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(302, 'KMC Ward 98 SWM Demo Agent', 'demo.kmc.ward98.swm@example.com', '9000000302', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(303, 'KMC Ward 98 Sanitation Demo Agent', 'demo.kmc.ward98.sanitation@example.com', '9000000303', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(304, 'KMC Ward 98 Water Demo Agent', 'demo.kmc.ward98.water@example.com', '9000000304', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(305, 'KMC Ward 99 SWM Demo Agent', 'demo.kmc.ward99.swm@example.com', '9000000305', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(306, 'KMC Ward 99 Sanitation Demo Agent', 'demo.kmc.ward99.sanitation@example.com', '9000000306', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(307, 'KMC Ward 99 Water Demo Agent', 'demo.kmc.ward99.water@example.com', '9000000307', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(308, 'KMC Ward 100 SWM Demo Agent', 'demo.kmc.ward100.swm@example.com', '9000000308', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(309, 'KMC Ward 100 Sanitation Demo Agent', 'demo.kmc.ward100.sanitation@example.com', '9000000309', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(310, 'KMC Ward 100 Water Demo Agent', 'demo.kmc.ward100.water@example.com', '9000000310', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(311, 'KMC Ward 101 SWM Demo Agent', 'demo.kmc.ward101.swm@example.com', '9000000311', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(312, 'KMC Ward 101 Sanitation Demo Agent', 'demo.kmc.ward101.sanitation@example.com', '9000000312', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(313, 'KMC Ward 101 Water Demo Agent', 'demo.kmc.ward101.water@example.com', '9000000313', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(314, 'KMC Ward 102 SWM Demo Agent', 'demo.kmc.ward102.swm@example.com', '9000000314', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(315, 'KMC Ward 102 Sanitation Demo Agent', 'demo.kmc.ward102.sanitation@example.com', '9000000315', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(316, 'KMC Ward 102 Water Demo Agent', 'demo.kmc.ward102.water@example.com', '9000000316', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(317, 'KMC Ward 103 SWM Demo Agent', 'demo.kmc.ward103.swm@example.com', '9000000317', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(318, 'KMC Ward 103 Sanitation Demo Agent', 'demo.kmc.ward103.sanitation@example.com', '9000000318', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(319, 'KMC Ward 103 Water Demo Agent', 'demo.kmc.ward103.water@example.com', '9000000319', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(320, 'KMC Ward 104 SWM Demo Agent', 'demo.kmc.ward104.swm@example.com', '9000000320', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(321, 'KMC Ward 104 Sanitation Demo Agent', 'demo.kmc.ward104.sanitation@example.com', '9000000321', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(322, 'KMC Ward 104 Water Demo Agent', 'demo.kmc.ward104.water@example.com', '9000000322', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(323, 'KMC Ward 105 SWM Demo Agent', 'demo.kmc.ward105.swm@example.com', '9000000323', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(324, 'KMC Ward 105 Sanitation Demo Agent', 'demo.kmc.ward105.sanitation@example.com', '9000000324', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(325, 'KMC Ward 105 Water Demo Agent', 'demo.kmc.ward105.water@example.com', '9000000325', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(326, 'KMC Ward 106 SWM Demo Agent', 'demo.kmc.ward106.swm@example.com', '9000000326', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(327, 'KMC Ward 106 Sanitation Demo Agent', 'demo.kmc.ward106.sanitation@example.com', '9000000327', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(328, 'KMC Ward 106 Water Demo Agent', 'demo.kmc.ward106.water@example.com', '9000000328', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(329, 'KMC Ward 107 SWM Demo Agent', 'demo.kmc.ward107.swm@example.com', '9000000329', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(330, 'KMC Ward 107 Sanitation Demo Agent', 'demo.kmc.ward107.sanitation@example.com', '9000000330', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(331, 'KMC Ward 107 Water Demo Agent', 'demo.kmc.ward107.water@example.com', '9000000331', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(332, 'KMC Ward 108 SWM Demo Agent', 'demo.kmc.ward108.swm@example.com', '9000000332', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(333, 'KMC Ward 108 Sanitation Demo Agent', 'demo.kmc.ward108.sanitation@example.com', '9000000333', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(334, 'KMC Ward 108 Water Demo Agent', 'demo.kmc.ward108.water@example.com', '9000000334', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(335, 'KMC Ward 109 SWM Demo Agent', 'demo.kmc.ward109.swm@example.com', '9000000335', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(336, 'KMC Ward 109 Sanitation Demo Agent', 'demo.kmc.ward109.sanitation@example.com', '9000000336', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(337, 'KMC Ward 109 Water Demo Agent', 'demo.kmc.ward109.water@example.com', '9000000337', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(338, 'KMC Ward 110 SWM Demo Agent', 'demo.kmc.ward110.swm@example.com', '9000000338', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(339, 'KMC Ward 110 Sanitation Demo Agent', 'demo.kmc.ward110.sanitation@example.com', '9000000339', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(340, 'KMC Ward 110 Water Demo Agent', 'demo.kmc.ward110.water@example.com', '9000000340', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(341, 'KMC Ward 111 SWM Demo Agent', 'demo.kmc.ward111.swm@example.com', '9000000341', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(342, 'KMC Ward 111 Sanitation Demo Agent', 'demo.kmc.ward111.sanitation@example.com', '9000000342', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(343, 'KMC Ward 111 Water Demo Agent', 'demo.kmc.ward111.water@example.com', '9000000343', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT');
INSERT INTO `users` (`user_id`, `full_name`, `email`, `phone`, `password_hash`, `created_at`, `role`) VALUES
(344, 'KMC Ward 112 SWM Demo Agent', 'demo.kmc.ward112.swm@example.com', '9000000344', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(345, 'KMC Ward 112 Sanitation Demo Agent', 'demo.kmc.ward112.sanitation@example.com', '9000000345', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(346, 'KMC Ward 112 Water Demo Agent', 'demo.kmc.ward112.water@example.com', '9000000346', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(347, 'KMC Ward 113 SWM Demo Agent', 'demo.kmc.ward113.swm@example.com', '9000000347', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(348, 'KMC Ward 113 Sanitation Demo Agent', 'demo.kmc.ward113.sanitation@example.com', '9000000348', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(349, 'KMC Ward 113 Water Demo Agent', 'demo.kmc.ward113.water@example.com', '9000000349', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(350, 'KMC Ward 114 SWM Demo Agent', 'demo.kmc.ward114.swm@example.com', '9000000350', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(351, 'KMC Ward 114 Sanitation Demo Agent', 'demo.kmc.ward114.sanitation@example.com', '9000000351', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(352, 'KMC Ward 114 Water Demo Agent', 'demo.kmc.ward114.water@example.com', '9000000352', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(353, 'KMC Ward 115 SWM Demo Agent', 'demo.kmc.ward115.swm@example.com', '9000000353', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(354, 'KMC Ward 115 Sanitation Demo Agent', 'demo.kmc.ward115.sanitation@example.com', '9000000354', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(355, 'KMC Ward 115 Water Demo Agent', 'demo.kmc.ward115.water@example.com', '9000000355', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(356, 'KMC Ward 116 SWM Demo Agent', 'demo.kmc.ward116.swm@example.com', '9000000356', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(357, 'KMC Ward 116 Sanitation Demo Agent', 'demo.kmc.ward116.sanitation@example.com', '9000000357', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(358, 'KMC Ward 116 Water Demo Agent', 'demo.kmc.ward116.water@example.com', '9000000358', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(359, 'KMC Ward 117 SWM Demo Agent', 'demo.kmc.ward117.swm@example.com', '9000000359', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(360, 'KMC Ward 117 Sanitation Demo Agent', 'demo.kmc.ward117.sanitation@example.com', '9000000360', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(361, 'KMC Ward 117 Water Demo Agent', 'demo.kmc.ward117.water@example.com', '9000000361', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(362, 'KMC Ward 118 SWM Demo Agent', 'demo.kmc.ward118.swm@example.com', '9000000362', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(363, 'KMC Ward 118 Sanitation Demo Agent', 'demo.kmc.ward118.sanitation@example.com', '9000000363', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(364, 'KMC Ward 118 Water Demo Agent', 'demo.kmc.ward118.water@example.com', '9000000364', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(365, 'KMC Ward 119 SWM Demo Agent', 'demo.kmc.ward119.swm@example.com', '9000000365', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(366, 'KMC Ward 119 Sanitation Demo Agent', 'demo.kmc.ward119.sanitation@example.com', '9000000366', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(367, 'KMC Ward 119 Water Demo Agent', 'demo.kmc.ward119.water@example.com', '9000000367', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(368, 'KMC Ward 120 SWM Demo Agent', 'demo.kmc.ward120.swm@example.com', '9000000368', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(369, 'KMC Ward 120 Sanitation Demo Agent', 'demo.kmc.ward120.sanitation@example.com', '9000000369', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(370, 'KMC Ward 120 Water Demo Agent', 'demo.kmc.ward120.water@example.com', '9000000370', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(371, 'KMC Ward 121 SWM Demo Agent', 'demo.kmc.ward121.swm@example.com', '9000000371', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(372, 'KMC Ward 121 Sanitation Demo Agent', 'demo.kmc.ward121.sanitation@example.com', '9000000372', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(373, 'KMC Ward 121 Water Demo Agent', 'demo.kmc.ward121.water@example.com', '9000000373', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(374, 'KMC Ward 122 SWM Demo Agent', 'demo.kmc.ward122.swm@example.com', '9000000374', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(375, 'KMC Ward 122 Sanitation Demo Agent', 'demo.kmc.ward122.sanitation@example.com', '9000000375', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(376, 'KMC Ward 122 Water Demo Agent', 'demo.kmc.ward122.water@example.com', '9000000376', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(377, 'KMC Ward 123 SWM Demo Agent', 'demo.kmc.ward123.swm@example.com', '9000000377', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(378, 'KMC Ward 123 Sanitation Demo Agent', 'demo.kmc.ward123.sanitation@example.com', '9000000378', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(379, 'KMC Ward 123 Water Demo Agent', 'demo.kmc.ward123.water@example.com', '9000000379', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(380, 'KMC Ward 124 SWM Demo Agent', 'demo.kmc.ward124.swm@example.com', '9000000380', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(381, 'KMC Ward 124 Sanitation Demo Agent', 'demo.kmc.ward124.sanitation@example.com', '9000000381', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(382, 'KMC Ward 124 Water Demo Agent', 'demo.kmc.ward124.water@example.com', '9000000382', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(383, 'KMC Ward 125 SWM Demo Agent', 'demo.kmc.ward125.swm@example.com', '9000000383', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(384, 'KMC Ward 125 Sanitation Demo Agent', 'demo.kmc.ward125.sanitation@example.com', '9000000384', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(385, 'KMC Ward 125 Water Demo Agent', 'demo.kmc.ward125.water@example.com', '9000000385', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(386, 'KMC Ward 126 SWM Demo Agent', 'demo.kmc.ward126.swm@example.com', '9000000386', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(387, 'KMC Ward 126 Sanitation Demo Agent', 'demo.kmc.ward126.sanitation@example.com', '9000000387', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(388, 'KMC Ward 126 Water Demo Agent', 'demo.kmc.ward126.water@example.com', '9000000388', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(389, 'KMC Ward 127 SWM Demo Agent', 'demo.kmc.ward127.swm@example.com', '9000000389', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(390, 'KMC Ward 127 Sanitation Demo Agent', 'demo.kmc.ward127.sanitation@example.com', '9000000390', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(391, 'KMC Ward 127 Water Demo Agent', 'demo.kmc.ward127.water@example.com', '9000000391', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(392, 'KMC Ward 128 SWM Demo Agent', 'demo.kmc.ward128.swm@example.com', '9000000392', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(393, 'KMC Ward 128 Sanitation Demo Agent', 'demo.kmc.ward128.sanitation@example.com', '9000000393', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(394, 'KMC Ward 128 Water Demo Agent', 'demo.kmc.ward128.water@example.com', '9000000394', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(395, 'KMC Ward 129 SWM Demo Agent', 'demo.kmc.ward129.swm@example.com', '9000000395', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(396, 'KMC Ward 129 Sanitation Demo Agent', 'demo.kmc.ward129.sanitation@example.com', '9000000396', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(397, 'KMC Ward 129 Water Demo Agent', 'demo.kmc.ward129.water@example.com', '9000000397', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(398, 'KMC Ward 130 SWM Demo Agent', 'demo.kmc.ward130.swm@example.com', '9000000398', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(399, 'KMC Ward 130 Sanitation Demo Agent', 'demo.kmc.ward130.sanitation@example.com', '9000000399', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(400, 'KMC Ward 130 Water Demo Agent', 'demo.kmc.ward130.water@example.com', '9000000400', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(401, 'KMC Ward 131 SWM Demo Agent', 'demo.kmc.ward131.swm@example.com', '9000000401', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(402, 'KMC Ward 131 Sanitation Demo Agent', 'demo.kmc.ward131.sanitation@example.com', '9000000402', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(403, 'KMC Ward 131 Water Demo Agent', 'demo.kmc.ward131.water@example.com', '9000000403', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(404, 'KMC Ward 132 SWM Demo Agent', 'demo.kmc.ward132.swm@example.com', '9000000404', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(405, 'KMC Ward 132 Sanitation Demo Agent', 'demo.kmc.ward132.sanitation@example.com', '9000000405', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(406, 'KMC Ward 132 Water Demo Agent', 'demo.kmc.ward132.water@example.com', '9000000406', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(407, 'KMC Ward 133 SWM Demo Agent', 'demo.kmc.ward133.swm@example.com', '9000000407', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(408, 'KMC Ward 133 Sanitation Demo Agent', 'demo.kmc.ward133.sanitation@example.com', '9000000408', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(409, 'KMC Ward 133 Water Demo Agent', 'demo.kmc.ward133.water@example.com', '9000000409', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(410, 'KMC Ward 134 SWM Demo Agent', 'demo.kmc.ward134.swm@example.com', '9000000410', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(411, 'KMC Ward 134 Sanitation Demo Agent', 'demo.kmc.ward134.sanitation@example.com', '9000000411', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(412, 'KMC Ward 134 Water Demo Agent', 'demo.kmc.ward134.water@example.com', '9000000412', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(413, 'KMC Ward 135 SWM Demo Agent', 'demo.kmc.ward135.swm@example.com', '9000000413', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(414, 'KMC Ward 135 Sanitation Demo Agent', 'demo.kmc.ward135.sanitation@example.com', '9000000414', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(415, 'KMC Ward 135 Water Demo Agent', 'demo.kmc.ward135.water@example.com', '9000000415', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(416, 'KMC Ward 136 SWM Demo Agent', 'demo.kmc.ward136.swm@example.com', '9000000416', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(417, 'KMC Ward 136 Sanitation Demo Agent', 'demo.kmc.ward136.sanitation@example.com', '9000000417', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(418, 'KMC Ward 136 Water Demo Agent', 'demo.kmc.ward136.water@example.com', '9000000418', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(419, 'KMC Ward 137 SWM Demo Agent', 'demo.kmc.ward137.swm@example.com', '9000000419', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(420, 'KMC Ward 137 Sanitation Demo Agent', 'demo.kmc.ward137.sanitation@example.com', '9000000420', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(421, 'KMC Ward 137 Water Demo Agent', 'demo.kmc.ward137.water@example.com', '9000000421', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(422, 'KMC Ward 138 SWM Demo Agent', 'demo.kmc.ward138.swm@example.com', '9000000422', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(423, 'KMC Ward 138 Sanitation Demo Agent', 'demo.kmc.ward138.sanitation@example.com', '9000000423', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(424, 'KMC Ward 138 Water Demo Agent', 'demo.kmc.ward138.water@example.com', '9000000424', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(425, 'KMC Ward 139 SWM Demo Agent', 'demo.kmc.ward139.swm@example.com', '9000000425', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(426, 'KMC Ward 139 Sanitation Demo Agent', 'demo.kmc.ward139.sanitation@example.com', '9000000426', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(427, 'KMC Ward 139 Water Demo Agent', 'demo.kmc.ward139.water@example.com', '9000000427', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(428, 'KMC Ward 140 SWM Demo Agent', 'demo.kmc.ward140.swm@example.com', '9000000428', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(429, 'KMC Ward 140 Sanitation Demo Agent', 'demo.kmc.ward140.sanitation@example.com', '9000000429', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(430, 'KMC Ward 140 Water Demo Agent', 'demo.kmc.ward140.water@example.com', '9000000430', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(431, 'KMC Ward 141 SWM Demo Agent', 'demo.kmc.ward141.swm@example.com', '9000000431', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(432, 'KMC Ward 141 Sanitation Demo Agent', 'demo.kmc.ward141.sanitation@example.com', '9000000432', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(433, 'KMC Ward 141 Water Demo Agent', 'demo.kmc.ward141.water@example.com', '9000000433', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(434, 'KMC Ward 142 SWM Demo Agent', 'demo.kmc.ward142.swm@example.com', '9000000434', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(435, 'KMC Ward 142 Sanitation Demo Agent', 'demo.kmc.ward142.sanitation@example.com', '9000000435', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(436, 'KMC Ward 142 Water Demo Agent', 'demo.kmc.ward142.water@example.com', '9000000436', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(437, 'KMC Ward 143 SWM Demo Agent', 'demo.kmc.ward143.swm@example.com', '9000000437', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(438, 'KMC Ward 143 Sanitation Demo Agent', 'demo.kmc.ward143.sanitation@example.com', '9000000438', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(439, 'KMC Ward 143 Water Demo Agent', 'demo.kmc.ward143.water@example.com', '9000000439', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(440, 'KMC Ward 144 SWM Demo Agent', 'demo.kmc.ward144.swm@example.com', '9000000440', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(441, 'KMC Ward 144 Sanitation Demo Agent', 'demo.kmc.ward144.sanitation@example.com', '9000000441', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(442, 'KMC Ward 144 Water Demo Agent', 'demo.kmc.ward144.water@example.com', '9000000442', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(443, 'Alipore Demo Agent', 'demo.police.alipore@example.com', '9000000443', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(444, 'Amherst Street Demo Agent', 'demo.police.amherst.street@example.com', '9000000444', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(445, 'Amherst Street Women Demo Agent', 'demo.police.amherst.street.women@example.com', '9000000445', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(446, 'Anandapur Demo Agent', 'demo.police.anandapur@example.com', '9000000446', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(447, 'Ballygunge Demo Agent', 'demo.police.ballygunge@example.com', '9000000447', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(448, 'Bansdroni Demo Agent', 'demo.police.bansdroni@example.com', '9000000448', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(449, 'Behala Demo Agent', 'demo.police.behala@example.com', '9000000449', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(450, 'Behala Women Demo Agent', 'demo.police.behala.women@example.com', '9000000450', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(451, 'Beliaghata Demo Agent', 'demo.police.beliaghata@example.com', '9000000451', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(452, 'Beniapukur Demo Agent', 'demo.police.beniapukur@example.com', '9000000452', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(453, 'Bhowanipur Demo Agent', 'demo.police.bhowanipur@example.com', '9000000453', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(454, 'Bhangar Demo Agent', 'demo.police.bhangar@example.com', '9000000454', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(455, 'Bijoyganj Bazar Police Station Demo Agent', 'demo.police.bijoyganj.bazar.police.station@example.com', '9000000455', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(456, 'Bodra Demo Agent', 'demo.police.bodra@example.com', '9000000456', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(457, 'Bowbazar Demo Agent', 'demo.police.bowbazar@example.com', '9000000457', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(458, 'Burrabazar Demo Agent', 'demo.police.burrabazar@example.com', '9000000458', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(459, 'Burtolla Demo Agent', 'demo.police.burtolla@example.com', '9000000459', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(460, 'Chandaneswar Demo Agent', 'demo.police.chandaneswar@example.com', '9000000460', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(461, 'Charu Market Demo Agent', 'demo.police.charu.market@example.com', '9000000461', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(462, 'Chetla Demo Agent', 'demo.police.chetla@example.com', '9000000462', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(463, 'Chitpur Demo Agent', 'demo.police.chitpur@example.com', '9000000463', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(464, 'Cossipore Demo Agent', 'demo.police.cossipore@example.com', '9000000464', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(465, 'Ekbalpur Demo Agent', 'demo.police.ekbalpur@example.com', '9000000465', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(466, 'Entally Demo Agent', 'demo.police.entally@example.com', '9000000466', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(467, 'Garden Reach Demo Agent', 'demo.police.garden.reach@example.com', '9000000467', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(468, 'Gariahat Demo Agent', 'demo.police.gariahat@example.com', '9000000468', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(469, 'Garfa Demo Agent', 'demo.police.garfa@example.com', '9000000469', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(470, 'Girish Park Demo Agent', 'demo.police.girish.park@example.com', '9000000470', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(471, 'Haridevpur Demo Agent', 'demo.police.haridevpur@example.com', '9000000471', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(472, 'Hare Street Demo Agent', 'demo.police.hare.street@example.com', '9000000472', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(473, 'Jadavpur Demo Agent', 'demo.police.jadavpur@example.com', '9000000473', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(474, 'Jorabagan Demo Agent', 'demo.police.jorabagan@example.com', '9000000474', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(475, 'Jorasanko Demo Agent', 'demo.police.jorasanko@example.com', '9000000475', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(476, 'Kalighat Demo Agent', 'demo.police.kalighat@example.com', '9000000476', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(477, 'Kasba Demo Agent', 'demo.police.kasba@example.com', '9000000477', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(478, 'Karaya Demo Agent', 'demo.police.karaya@example.com', '9000000478', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(479, 'Lake Demo Agent', 'demo.police.lake@example.com', '9000000479', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(480, 'Manicktala Demo Agent', 'demo.police.manicktala@example.com', '9000000480', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(481, 'Metiabruz Demo Agent', 'demo.police.metiabruz@example.com', '9000000481', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(482, 'Muchipara Demo Agent', 'demo.police.muchipara@example.com', '9000000482', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(483, 'Narkeldanga Demo Agent', 'demo.police.narkeldanga@example.com', '9000000483', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(484, 'New Alipore Demo Agent', 'demo.police.new.alipore@example.com', '9000000484', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(485, 'New Market Demo Agent', 'demo.police.new.market@example.com', '9000000485', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(486, 'Park Street Demo Agent', 'demo.police.park.street@example.com', '9000000486', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(487, 'Patuli Demo Agent', 'demo.police.patuli@example.com', '9000000487', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(488, 'Phoolbagan Demo Agent', 'demo.police.phoolbagan@example.com', '9000000488', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(489, 'Posta Demo Agent', 'demo.police.posta@example.com', '9000000489', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(490, 'Purba Jadavpur Demo Agent', 'demo.police.purba.jadavpur@example.com', '9000000490', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(491, 'Regent Park Demo Agent', 'demo.police.regent.park@example.com', '9000000491', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(492, 'Shakespeare Sarani Demo Agent', 'demo.police.shakespeare.sarani@example.com', '9000000492', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(493, 'Shyampukur Demo Agent', 'demo.police.shyampukur@example.com', '9000000493', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(494, 'Sinthee Demo Agent', 'demo.police.sinthee@example.com', '9000000494', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(495, 'South Port Demo Agent', 'demo.police.south.port@example.com', '9000000495', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(496, 'Survey Park Demo Agent', 'demo.police.survey.park@example.com', '9000000496', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(497, 'Tala Demo Agent', 'demo.police.tala@example.com', '9000000497', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(498, 'Tangra Demo Agent', 'demo.police.tangra@example.com', '9000000498', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(499, 'Taratala Demo Agent', 'demo.police.taratala@example.com', '9000000499', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(500, 'Thakurpukur Demo Agent', 'demo.police.thakurpukur@example.com', '9000000500', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(501, 'Tiljala Demo Agent', 'demo.police.tiljala@example.com', '9000000501', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(502, 'Tollygunge Demo Agent', 'demo.police.tollygunge@example.com', '9000000502', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(503, 'Topsia Demo Agent', 'demo.police.topsia@example.com', '9000000503', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(504, 'Ultadanga Demo Agent', 'demo.police.ultadanga@example.com', '9000000504', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(505, 'Watgunge Demo Agent', 'demo.police.watgunge@example.com', '9000000505', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(506, 'West Port Demo Agent', 'demo.police.west.port@example.com', '9000000506', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(507, 'Bhowanipore Women Demo Agent', 'demo.police.bhowanipore.women@example.com', '9000000507', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(508, 'Survey Park Women Demo Agent', 'demo.police.survey.park.women@example.com', '9000000508', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(509, 'Patuli Women Demo Agent', 'demo.police.patuli.women@example.com', '9000000509', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(510, 'Netaji Nagar Demo Agent', 'demo.police.netaji.nagar@example.com', '9000000510', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(511, 'Parnasree Demo Agent', 'demo.police.parnasree@example.com', '9000000511', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(512, 'Sarsuna Demo Agent', 'demo.police.sarsuna@example.com', '9000000512', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(513, 'Beniapukur Women Demo Agent', 'demo.police.beniapukur.women@example.com', '9000000513', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(514, 'Tiljala Women Demo Agent', 'demo.police.tiljala.women@example.com', '9000000514', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(515, 'Jadavpur Women Demo Agent', 'demo.police.jadavpur.women@example.com', '9000000515', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(516, 'Burrabazar Women Demo Agent', 'demo.police.burrabazar.women@example.com', '9000000516', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(517, 'North Port Demo Agent', 'demo.police.north.port@example.com', '9000000517', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(518, 'Rajabagan Demo Agent', 'demo.police.rajabagan@example.com', '9000000518', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(519, 'Rabindra Sarobar Demo Agent', 'demo.police.rabindra.sarobar@example.com', '9000000519', 'REPLACE_WITH_BCRYPT_HASH', '2026-10-14 07:39:19', 'AGENT'),
(520, 'Amit Kumar', 'amit@kmc.example.com', '9876543210', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(521, 'Rohit Das', 'rohit@kmc.example.com', '9876543211', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(522, 'Priya Sen', 'priya@kmc.example.com', '9876543212', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(523, 'Arjun Roy', 'arjun@kmc.example.com', '9876543213', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(524, 'Suman Ghosh', 'suman@water.example.com', '9876543214', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(525, 'Ananya Paul', 'ananya@water.example.com', '9876543215', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(526, 'Rajib Dutta', 'rajib@police.example.com', '9876543216', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(527, 'Neha Sharma', 'neha@police.example.com', '9876543217', '$2b$12$ktj1P8lR2fvDuy4X6RsePu2rIZyjH6s3hmr25DA7T7.VUu8BHckou', '2026-10-14 07:44:07', 'AGENT'),
(528, 'Admin', 'admin@gmail.com', '0123456789', '$2b$12$0QjOoTDgyG7EptOw1awnde05K.v9baz7PgAy6BGmBIdC.qmnACY0C', '2026-10-25 14:00:46', 'ADMIN'),
(529, 'User', 'user@gmail.com', '1234567890', '$2b$12$7XXRRc47JDoffXSprlaL9OcdzflTf2GjVHWksf7Md2gqbAw7uXtPC', '2026-10-25 15:26:47', 'USER'),
(530, 'Agent', 'agent@gmail.com', '9999999999', '$2b$12$xRiAMBtB0Qk3Busa/PkHbeNCycHwKRDtqIylkd3ZTDjg8dB6LJNPS', '2026-10-25 15:44:49', 'AGENT');

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
  ADD UNIQUE KEY `uq_facilities_source_recommendation` (`source_recommendation_id`),
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
  ADD KEY `idx_recommendations_status` (`status`),
  ADD KEY `fk_recommendations_agent` (`assigned_agent`);

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
  ADD KEY `idx_reports_status` (`status`),
  ADD KEY `fk_reports_agent` (`assigned_agent`);

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
  MODIFY `agent_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `facility_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

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
  MODIFY `recommendation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `recommendation_investigations`
--
ALTER TABLE `recommendation_investigations`
  MODIFY `investigation_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `report_resolution_submissions`
--
ALTER TABLE `report_resolution_submissions`
  MODIFY `resolution_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=531;

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
  ADD CONSTRAINT `fk_facilities_category` FOREIGN KEY (`category_id`) REFERENCES `facility_categories` (`category_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_facilities_source_recommendation` FOREIGN KEY (`source_recommendation_id`) REFERENCES `recommendations` (`recommendation_id`) ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_recommendations_agent` FOREIGN KEY (`assigned_agent`) REFERENCES `agency_members` (`agent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
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
  ADD CONSTRAINT `fk_reports_agent` FOREIGN KEY (`assigned_agent`) REFERENCES `agency_members` (`agent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
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
