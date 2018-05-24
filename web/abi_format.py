f = open("file.txt",'r')

s = f.read()

s = s.replace(' ','')
s = s.replace('\t','')
s = s.replace('\n','')

print s
f.close()
