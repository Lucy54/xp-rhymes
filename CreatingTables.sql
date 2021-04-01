
CREATE TABLE data_log(
prim_subject DEC(10,5) PRIMARY KEY,
subjectID DEC(5,0),
dateInfo VARCHAR(50), 
conditionProto DEC(1,0), 
success VARCHAR(10),
trial_type VARCHAR(50),
trial_index DEC(10,0),
time_elapsed DEC(15,0),
internal_node_id VARCHAR(20),
rt DEC(10,3),
responses TEXT,
question_order VARCHAR(20),
stimulus VARCHAR(50),
button_pressed DEC(2,0),
key_press DEC(2,0),
correct VARCHAR (10),
response DEC(3,0),
prompt VARCHAR(10),
stimLeft VARCHAR(40),
stimRight VARCHAR(40),
targetSide VARCHAR(10)
); 


CREATE TABLE condition_log(
rowID INT AUTO_INCREMENT PRIMARY KEY, 
subjectID DEC(5,0), 
assignedCondition DEC(1,0)
);

CREATE TABLE register_log(
rowID INT AUTO_INCREMENT PRIMARY KEY,
workerID VARCHAR(20),
completionCode VARCHAR(20)
); 

CREATE TABLE completion_log(
rowID INT AUTO_INCREMENT PRIMARY KEY,
workerID VARCHAR(20)
); 