import sys
import io

def run(args):

    f = open('./1.json',"w")
    f.write(args)
    f.close()
    print("test node run python args:" + args)

run(sys.argv[1])