-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: room_booking_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roomId` int NOT NULL,
  `userId` int DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isCancelled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `bookings_room_fk` (`roomId`),
  CONSTRAINT `bookings_room_fk` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (18,1,15,'2025-06-11 08:31:00','2025-06-11 09:00:00','1','2025-06-11 11:22:11','2025-06-11 11:22:11',0),(19,1,15,'2025-06-12 14:01:00','2025-06-12 14:30:00','2','2025-06-11 11:23:56','2025-06-11 11:23:56',0),(20,1,15,'2025-06-14 17:01:00','2025-06-14 17:30:00','3','2025-06-11 11:24:41','2025-06-11 11:24:41',0),(21,1,15,'2025-06-11 11:01:00','2025-06-11 11:30:00','4','2025-06-11 11:25:34','2025-06-11 11:25:34',0),(22,1,15,'2025-06-11 11:31:00','2025-06-11 12:00:00','5','2025-06-11 11:25:40','2025-06-11 11:25:40',0),(23,1,15,'2025-06-11 12:31:00','2025-06-11 13:00:00','6','2025-06-11 11:25:53','2025-06-11 11:25:53',0),(24,2,15,'2025-06-12 09:01:00','2025-06-12 09:30:00','4','2025-06-11 11:26:06','2025-06-11 11:26:06',0),(25,3,15,'2025-06-13 09:31:00','2025-06-13 10:00:00','1','2025-06-11 11:26:23','2025-06-11 11:26:23',0),(26,4,15,'2025-06-14 15:01:00','2025-06-14 15:30:00','11','2025-06-11 11:26:37','2025-06-11 11:26:37',0),(27,4,15,'2025-06-17 11:31:00','2025-06-17 12:00:00','11','2025-06-11 11:29:03','2025-06-11 11:29:03',0),(28,6,15,'2025-06-25 12:01:00','2025-06-25 12:30:00','98','2025-06-11 11:29:14','2025-06-11 11:29:14',0);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `capacity` int NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `phone` varchar(20) DEFAULT NULL,
  `noOfChairs` int DEFAULT NULL,
  `hasTV` tinyint(1) DEFAULT '0',
  `hasMonitor` tinyint(1) DEFAULT '0',
  `hasBoard` tinyint(1) DEFAULT '0',
  `isWorking` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Conference Room A',10,'Floor 1','Large conference room with projector',NULL,NULL,0,0,0,1),(2,'Meeting Room B',4,'Floor 2','Small meeting room for quick discussions',NULL,NULL,0,0,0,1),(3,'Training Room C',20,'Floor 3','Spacious room for training sessions',NULL,NULL,0,0,0,1),(4,'Room 102',8,'102','Good','102',4,0,0,0,1),(5,'Room 103',8,'102','Good','102',4,0,0,0,0),(6,'Room 104',12,'102','Conference','102',8,1,0,1,1),(7,'Room 105',8,'102','Good','102',4,0,0,0,1),(8,'Room 106',8,'102','Good','102',4,0,0,0,1),(9,'Room 107',8,'102','Good','102',4,0,0,0,1),(10,'Room 108',6,'102','Normal Room','102',3,0,0,0,1),(12,'Cafeteria',40,'Cafeteria',NULL,'114',8,1,0,1,1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) NOT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `employeeId` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employeeId` (`employeeId`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'phone',NULL,NULL,0,'2025-06-11 07:51:14','email','name','employeeId'),(2,'9426212181',NULL,NULL,0,'2025-06-11 07:51:14','nitesh@lucentinnovation.com','Nitesh Kasma','1'),(3,'9428124379',NULL,NULL,0,'2025-06-11 07:51:14','ashish@lucentinnovation.com','Ashish Kasama','2'),(4,'9722264157',NULL,NULL,0,'2025-06-11 07:51:14','prakash@lucentinnovation.com','Prakash Prabhakar','11'),(5,'9173688299',NULL,NULL,0,'2025-06-11 07:51:14','krunal@lucentinnovation.com','Krunal Prajapati','14'),(6,'8758195390',NULL,NULL,0,'2025-06-11 07:51:14','harshad@lucentinnovation.com','Harshad Parmar','26'),(7,'9904354213',NULL,NULL,0,'2025-06-11 07:51:14','mitesh@lucentinnovation.com','Mitesh Patel','37'),(8,'9327144864',NULL,NULL,0,'2025-06-11 07:51:14','shaan@lucentinnovation.com','Sahar Desai','55'),(9,'8871523163',NULL,NULL,0,'2025-06-11 07:51:14','aman@lucentinnovation.com','Aman Jain','64'),(10,'8734007493',NULL,NULL,0,'2025-06-11 07:51:14','ram@lucentinnovation.com','Ram Soni','84'),(11,'9713607682',NULL,NULL,0,'2025-06-11 07:51:14','jyoti@lucentinnovation.com','Jyoti Singh','91'),(12,'79760 81830',NULL,NULL,0,'2025-06-11 07:51:14','himanshi@lucentinnovation.com','Himanshi Chauhan','128'),(13,'98246 95318',NULL,NULL,0,'2025-06-11 07:51:14','bhavik@lucentinnovation.com','Bhavik Patel','134'),(14,'7490071832',NULL,NULL,0,'2025-06-11 07:51:14','minaxiben@lucentinnovation.com','Meenakshi Sharma','141'),(15,'9753447197',NULL,NULL,0,'2025-06-11 07:51:14','liladhar.dhangar@lucentinnovation.com','Liladhar Gayri','144'),(16,'9824925385',NULL,NULL,0,'2025-06-11 07:51:14','mayur.vaghela@lucentinnovation.com','Mayursinh Vaghela','146'),(17,'8866143230',NULL,NULL,0,'2025-06-11 07:51:14','piyush.gajjar@lucentinnovation.com','Piyush Gajjar','157'),(18,'7733071978',NULL,NULL,0,'2025-06-11 07:51:14','himanshu.chhaparwal@lucentinnovation.com','Himanshu Chhaparwal','172'),(19,'8735916939',NULL,NULL,0,'2025-06-11 07:51:14','ganesh.thappa@lucentinnovation.com','Ganesh Thapa','205'),(20,'9429412376',NULL,NULL,0,'2025-06-11 07:51:14','umang.pandya@lucentinnovation.com','Umang Pandya','219'),(21,'7874951827',NULL,NULL,0,'2025-06-11 07:51:14','dev.bhatia@lucentinnovation.com','Dev Bhatia','221'),(22,'7622074571',NULL,NULL,0,'2025-06-11 07:51:14','akshay.maradiya@lucentinnovation.com','Akshay Maradiya','225'),(23,'9227162602',NULL,NULL,0,'2025-06-11 07:51:14','akshay.makwana@lucentinnovation.com','Akshay Makwana','229'),(24,'9898362643',NULL,NULL,0,'2025-06-11 07:51:14','jayveersinh.mahida@lucentinnovation.com','Jayveersinh Mahida','234'),(25,'9574543124',NULL,NULL,0,'2025-06-11 07:51:14','satish.prajapati@lucentinnovation.com','Satish Prajapati','239'),(26,'7620941253',NULL,NULL,0,'2025-06-11 07:51:14','shailesh.pokharkar@lucentinnovation.com','Shailesh Pokharkar','241'),(27,'8858138543',NULL,NULL,0,'2025-06-11 07:51:14','harshit.mishra@lucentinnovation.com','Harshit Mishra','243'),(28,'9723368523',NULL,NULL,0,'2025-06-11 07:51:14','ashish.kalaria@lucentinnovation.com','Ashish Kalaria','245'),(29,'8780083466',NULL,NULL,0,'2025-06-11 07:51:14','bhavik.gohil@lucentinnovation.com','Bhavik Gohil','246'),(30,'7405344979',NULL,NULL,0,'2025-06-11 07:51:14','ayush.yadav@lucentinnovation.com','Ayush Yadav','247'),(31,'9558711395',NULL,NULL,0,'2025-06-11 07:51:14','sanket.tank@lucentinnovation.com','Sanket Tank','250'),(32,'8160497241',NULL,NULL,0,'2025-06-11 07:51:14','vaishali.singh@lucentinnovation.com','Vaishali Singh','252'),(33,'9106622004',NULL,NULL,0,'2025-06-11 07:51:14','nishita.mevada@lucentinnovation.com','Nishita Mevada','258'),(34,'9510544520',NULL,NULL,0,'2025-06-11 07:51:14','nikita.mevada@lucentinnovation.com','Nikita Mevada','259'),(35,'7201090719',NULL,NULL,0,'2025-06-11 07:51:14','dipesh.khedkar@lucentinnovation.com','Dipesh Khedkar','260'),(36,'9898017140',NULL,NULL,0,'2025-06-11 07:51:14','kausar.savani@lucentinnovation.com','Kausar Savani','261'),(37,'9328063497',NULL,NULL,0,'2025-06-11 07:51:14','nikita.parmar@lucentinnovation.com','Nikita Parmar','262'),(38,'8866110314',NULL,NULL,0,'2025-06-11 07:51:14','devyansh.solanki@lucentinnovation.com','Devyansh Solanki','263'),(39,'7984424336',NULL,NULL,0,'2025-06-11 07:51:14','bhadra.gurnani@lucentinnovation.com','Bhadra Gurnani','273'),(40,'8546040002',NULL,NULL,0,'2025-06-11 07:51:14','prashant.sachan@lucentinnovation.com','Prashant Sachan','274'),(41,'9409243855',NULL,NULL,0,'2025-06-11 07:51:14','akshay.patel@lucentinnovation.com','Akshay Patel','275'),(42,'9594051750',NULL,NULL,0,'2025-06-11 07:51:14','jay.gandhi@lucentinnovation.com','Jay Gandhi','276'),(43,'8238947237',NULL,NULL,0,'2025-06-11 07:51:14','deep.raval@lucentinnovation.com','Deep Raval','278'),(44,'9998806145',NULL,NULL,0,'2025-06-11 07:51:14','akshar.dhameliya@lucentinnovation.com','Akshar Dhameliya','281'),(45,'7617384850',NULL,NULL,0,'2025-06-11 07:51:14','varun.sharma@lucentinnovation.com','Varun Sharma','284'),(46,'9998674780',NULL,NULL,0,'2025-06-11 07:51:14','salman.sandhi@lucentinnovation.com','Salman Sandhi','285'),(47,'9150927689',NULL,NULL,0,'2025-06-11 07:51:14','suhani@lucentinnovation.com','Suhani Jain','286'),(48,'9773225913',NULL,NULL,0,'2025-06-11 07:51:14','arjun.makwana@lucentinnovation.com','Arjun Makwana','287'),(49,'7043625716',NULL,NULL,0,'2025-06-11 07:51:14','mihir.patel@lucentinnovation.com','Mihir Patel','288'),(50,'7046609019',NULL,NULL,0,'2025-06-11 07:51:14','ani.modi@lucentinnovation.com','Ani Modi','289'),(51,'8200240937 ',NULL,NULL,0,'2025-06-11 07:51:14','harsh.vyas@lucentinnovation.com','Harsh Vyas','291'),(52,'8840418726',NULL,NULL,0,'2025-06-11 07:51:14','ajay.sahu@lucentinnovation.com','Ajay Sahu','292'),(53,'8320394275',NULL,NULL,0,'2025-06-11 07:51:14','mihir.sharma@lucentinnovation.com','Mihir Sharma','293'),(54,'8827173701',NULL,NULL,0,'2025-06-11 07:51:14','bhanu@lucentinnovation.com','Bhanu Pratap Singh','295'),(55,'6351998007',NULL,NULL,0,'2025-06-11 07:51:14','aasav.pandya@lucentinnovation.com','Asav Pandya','296'),(56,'9328823677',NULL,NULL,0,'2025-06-11 07:51:14','prince.katrodiya@lucentinnovation.com','Prince Katrodiya','297'),(57,'7567706767',NULL,NULL,0,'2025-06-11 07:51:14','vinesh.dodiya@lucentinnovation.com','Vinesh Dodiya','299'),(58,'7623909167',NULL,NULL,0,'2025-06-11 07:51:14','naisahadev@gmail.com','Sahadev Nai','301'),(59,'8758522561',NULL,NULL,0,'2025-06-11 07:51:14','pawarshubham76982977901@gmail.com','Shubham Pawar','302'),(60,'6359578171',NULL,NULL,0,'2025-06-11 07:51:14','effiemac04@gmail.com','Effie Macwan','303'),(61,'9898006974',NULL,NULL,0,'2025-06-11 07:51:14','devshah207@gmail.com','Dev Shah','304'),(62,'',NULL,NULL,0,'2025-06-11 07:51:14','jaybhanushali455@gmail.com','Jayantkumar Hurbada','305'),(63,'9429505634',NULL,NULL,0,'2025-06-11 07:51:14','himanshumakwana5634@gmail.com','Himanshu Makwana','306'),(64,'8799622693',NULL,NULL,0,'2025-06-11 07:51:14','tejash10army@gmail.com','Tejash Rajput','307'),(65,'9870017748',NULL,NULL,0,'2025-06-11 07:51:14','jatinsolanki1202@gmail.com','Jatin Solanki','308'),(66,'9601184320',NULL,NULL,0,'2025-06-11 07:51:14','kartikdhumal24@gmail.com','Kartik Dhumal','309'),(67,'9119870671',NULL,NULL,0,'2025-06-11 07:51:14','aayushim026@gmail.com','Aayushi Mishra','310'),(68,'9016440567',NULL,NULL,0,'2025-06-11 07:51:14','apgohel98@gmail.com','Abhishek Gohel','311'),(69,'9625603975',NULL,NULL,0,'2025-06-11 07:51:14','sid192003@gmail.com','Siddharth Gupta','312'),(70,'9737893602',NULL,NULL,0,'2025-06-11 07:51:14','avanikathiriya24@gmail.com','Avani Kathiriya','313'),(71,'7043050653',NULL,NULL,0,'2025-06-11 07:51:14','poorviraval21@gmail.com','Poorvi Raval','314'),(72,'9302507258',NULL,NULL,0,'2025-06-11 07:51:14','sheetalrajput3497@gmail.com','Sheetal Rajput','315'),(73,'8320813648',NULL,NULL,0,'2025-06-11 07:51:14','divyagohil0103@gmail.com','Divyaraj Gohil','316'),(74,'9408646580',NULL,NULL,0,'2025-06-11 07:51:14','hemangi.chavda@lucentinnovation.com','Hemangi Chavda','317'),(75,'9624104833',NULL,NULL,0,'2025-06-11 07:51:14','dip.jagodara@lucentinnovation.com','Dip Jagodara','318'),(76,'9978359504',NULL,NULL,0,'2025-06-11 07:51:14','pallav.shah@lucentinnovation.com','Pallav Shah','319'),(77,'7879343050',NULL,NULL,0,'2025-06-11 07:51:14','nandini.jadon@lucentinnovation.com','Nandani Jadon','320'),(78,'9316563638',NULL,NULL,0,'2025-06-11 07:51:14','jaydeep.mangaliya@lucentinnovation.com','Jaydeep Mangaliya','321'),(79,'8269789867',NULL,NULL,0,'2025-06-11 07:51:14','radhesh.shrivastava@lucentinnovation.com','Radhesh Shrivastava','322'),(80,'7600099846',NULL,NULL,0,'2025-06-11 07:51:14','krita.faldu@lucentinnovation.com','Krita Faldu','324'),(81,'8160273071',NULL,NULL,0,'2025-06-11 07:51:14','shivani.makwana@lucentinnovation.com','Shivani Makwana','325'),(82,'9265604603',NULL,NULL,0,'2025-06-11 07:51:14','shivamsingh.rajput@lucentinnovation.com','Shivamsingh Rajput','326'),(83,'9328772432',NULL,NULL,0,'2025-06-11 07:51:14','dharmik.chavda@lucentinnovation.com','Dharmik Chavda','327'),(84,'8792819730',NULL,NULL,0,'2025-06-11 07:51:14','kanha.routa@lucentinnovation.com','Kanha Routa','328'),(85,'6353520120',NULL,NULL,0,'2025-06-11 07:51:14','vandan.rathod@lucentinnovation.com','Vandan Rathod','330'),(86,'6352461578',NULL,NULL,0,'2025-06-11 07:51:14','rahul.kalasuva@lucentinnovation.com','Rahul Kalasuva','331'),(87,'7862877687',NULL,NULL,0,'2025-06-11 07:51:14','kashish.buddhdev@lucentinnovation.com','Kashish Buddhdev','332'),(88,'8866198646',NULL,NULL,0,'2025-06-11 07:51:14','sagar.sundavadra@lucentinnovation.com','Sagar Sundavadra','333');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 15:07:31
