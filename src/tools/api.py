import sys
import io

def run(args):

    f = open('./temp.json',"w",encoding="utf-8")
    f.write(args)
    f.close()
    print("test node run python args:" + args)

run(sys.argv[1])